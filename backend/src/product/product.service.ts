import {
   BadRequestException,
   ConflictException,
   ForbiddenException,
   Injectable,
   Logger,
   NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/aws/aws.service';
import { CREATED_PRODUCT_EVENT } from 'src/events/created-product.event';
import { SellerRating } from 'src/rating/entities/seller-rating.entity';
import { diffInDaysFromNow } from 'src/shared/helpers/date.helper';
import { Role, User } from 'src/user/entities/user.entity';
import {
   EntityManager,
   FindOptionsSelect,
   IsNull,
   Not,
   Raw,
   Repository,
} from 'typeorm';
import { Payment } from '../barion/entities/payment.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { Product } from './entities/product.entity';

const SIMPLE_PRODUCT_PROPERTIES: FindOptionsSelect<Product> = {
   id: true,
   condition: true,
   name: true,
   price: true,
   pictures: true,
   isAuction: true,
   expiration: true,
   seller: {
      id: true,
      name: true,
      picture: true,
   },
};
const SELLER_RATING_PROPERTIES: FindOptionsSelect<SellerRating> = {
   id: true,
   communication: true,
   delivery: true,
   quality: true,
   transaction: true,
};

@Injectable()
export class ProductService {
   logger = new Logger(ProductService.name);

   constructor(
      @InjectRepository(Product)
      private readonly productRepo: Repository<Product>,
      private readonly awsService: AwsService,
      private eventEmitter: EventEmitter2,
      private em: EntityManager,
   ) {}

   async create(createProductDto: CreateProductDto) {
      const signedUrls = await this.awsService.signUrls(
         'product',
         createProductDto.pictures,
      );

      createProductDto.pictures = createProductDto.pictures.map((fileName) => {
         const signedUrl = signedUrls.find(
            (signedUrl) => signedUrl.name === fileName,
         );
         if (!signedUrl) {
            this.logger.error(
               'Something went wrong while signing product pictures',
            );
            throw Error();
         }
         return signedUrl.url;
      });

      const product = await this.productRepo.save(createProductDto);
      this.eventEmitter.emit(CREATED_PRODUCT_EVENT, product);

      return signedUrls;
   }

   findAll(categoryId?: number) {
      return this.productRepo.find({
         select: {
            id: true,
            name: true,
            seller: {
               id: true,
               name: true,
            },
            highestBidder: {
               id: true,
               name: true,
            },
            price: true,
            pictures: true,
            condition: true,
            expiration: true,
            isAuction: true,
         },
         where: {
            ...(categoryId == null ? {} : { categoryId }),
            transactionId: IsNull(),
            expiration: Raw(
               (alias) =>
                  `((${alias} is null) or (${alias} > (date_trunc('day', (now() AT TIME ZONE 'Europe/Budapest')) AT TIME ZONE 'Europe/Budapest')::date))`,
            ),
         },
         relations: ['seller', 'highestBidder'],
      });
   }

   findOne(id: number) {
      return this.productRepo.findOneOrFail({
         // sele
         where: {
            id,
         },
         relations: {
            seller: true,
            highestBidder: true,
         },
      });
   }

   findWhere(findProductDto: FindProductDto): Promise<Product[]> {
      const sql = this.productRepo
         .createQueryBuilder('p')
         .leftJoinAndMapOne('p.seller', User, 'u', 'u.id = p.sellerId')
         .where('p.properties @> :props::jsonb', {
            props: findProductDto.properties,
         })
         .andWhere('p.categoryId = :categoryId', {
            categoryId: findProductDto.categoryId,
         })
         .andWhere(
            `((p.expiration is null) or (p.expiration > (date_trunc('day', (now() AT TIME ZONE 'Europe/Budapest')) AT TIME ZONE 'Europe/Budapest')::date))`,
         )
         .andWhere('p.transactionId is null');

      const { isAuction, startedFrom, expireUntil, price, priceUntil } =
         findProductDto;

      if (startedFrom) {
         sql.andWhere('p.created_date >= :startedFrom', { startedFrom });
      }

      if (expireUntil) {
         sql.andWhere('p.expiration < :expireUntil', { expireUntil });
      }

      if (isAuction !== undefined) {
         sql.andWhere('p.isAuction = :isAuction', { isAuction });
      }

      if (price !== undefined) {
         sql.andWhere('p.price >= :price', { price });
      }

      if (priceUntil !== undefined) {
         sql.andWhere('p.price < :priceUntil', { priceUntil });
      }

      return sql.getMany();
   }

   async remove(user: User, id: number) {
      const { affected } = await this.productRepo.manager.transaction(
         async (transaction) => {
            const product = await transaction.findOne(Product, {
               lock: { mode: 'pessimistic_write' },
               where: {
                  id,
               },
            });

            if (!product) {
               throw new NotFoundException();
            }

            if (user.role !== Role.admin && user.id !== product.sellerId) {
               throw new ForbiddenException();
            }

            if (product.transaction) {
               throw new ConflictException({
                  message:
                     'A terméket már kifizették, a hírdetés nem törölhető!',
               });
            }

            const diffInDays = product.expiration
               ? diffInDaysFromNow(product.expiration)
               : undefined;
            if (
               product.isAuction &&
               product.expiration &&
               product.highestBidder &&
               diffInDays !== undefined &&
               diffInDays > 0 &&
               diffInDays < 7
            ) {
               throw new BadRequestException({
                  message:
                     'A termék nem törölhető, a vevőnek 7 nap áll rendelkezésére a termék kifizetéséhez!',
               });
            }

            return transaction.delete(Product, { id });
         },
      );
      return affected;
   }

   async bid(
      user: User,
      newPrice: number,
      productId: number,
   ): Promise<
      | {
           success: true;
        }
      | { success: false; product: Product }
   > {
      const { affected } = await this.productRepo
         .createQueryBuilder()
         .update(Product)
         .set({
            price: newPrice,
            highestBidderId: user.id,
         })
         .where('price + minBid <= :newPrice', { newPrice })
         .andWhere('id = :productId', { productId })
         .andWhere(
            `(date_trunc('day', (now() AT TIME ZONE 'Europe/Budapest')) AT TIME ZONE 'Europe/Budapest')::date < expiration`,
         )
         .execute();

      const success = affected === 1;

      if (!success) {
         const product = (await this.productRepo.findOne({
            select: {
               id: true,
               price: true,
               highestBidder: { id: true, name: true, picture: true },
            },
            where: { id: productId },
            relations: ['highestBidder'],
         }))!;
         return {
            success,
            product,
         };
      }

      return { success };
   }

   async boughtProductsForBuyer(id: number): Promise<Product[]> {
      const payments = await this.em.find(Payment, {
         select: {
            products: {
               ...SIMPLE_PRODUCT_PROPERTIES,
               sellerRating: {
                  ...SELLER_RATING_PROPERTIES,
               },
            },
         },
         relations: {
            products: {
               seller: true,
               sellerRating: true,
            },
         },
         where: {
            buyerId: id,
         },
      });
      return payments.flatMap((p) => p.products);
   }

   expiredAuctionsForSeller(id: number): Promise<Product[]> {
      return this.em.find(Product, {
         select: {
            ...SIMPLE_PRODUCT_PROPERTIES,
         },
         relations: {
            seller: true,
         },
         where: {
            sellerId: id,
            highestBidderId: IsNull(),
            expiration: Raw(
               (alias) =>
                  `${alias} <= (date_trunc('day', (now() AT TIME ZONE 'Europe/Budapest')) AT TIME ZONE 'Europe/Budapest')::date`,
            ),
         },
      });
   }

   successAuctionsForBuyer(id: number): Promise<Product[]> {
      return this.em.find(Product, {
         select: {
            ...SIMPLE_PRODUCT_PROPERTIES,
         },
         relations: {
            seller: true,
         },
         where: {
            sellerId: id,
            highestBidderId: Not(IsNull()),
            transactionId: IsNull(),
            expiration: Raw(
               (alias) =>
                  `${alias} <= (date_trunc('day', (now() AT TIME ZONE 'Europe/Budapest')) AT TIME ZONE 'Europe/Budapest')::date`,
            ),
         },
      });
   }

   pendingProductsForSeller(id: number): Promise<Product[]> {
      return this.em.find(Product, {
         select: {
            ...SIMPLE_PRODUCT_PROPERTIES,
         },
         relations: {
            seller: true,
         },
         where: {
            sellerId: id,
            transactionId: IsNull(),
            expiration: Raw(
               (alias) =>
                  `(${alias} is null or ${alias} > (date_trunc('day', (now() AT TIME ZONE 'Europe/Budapest')) AT TIME ZONE 'Europe/Budapest')::date)`,
            ),
         },
      });
   }

   successProductsForSeller(id: number): Promise<Product[]> {
      return this.em.find(Product, {
         select: {
            ...SIMPLE_PRODUCT_PROPERTIES,
            sellerRating: {
               ...SELLER_RATING_PROPERTIES,
            },
         },
         relations: {
            seller: true,
            sellerRating: true,
         },
         where: {
            sellerId: id,
            transactionId: Not(IsNull()),
         },
      });
   }

   async wonAuctionsForBuyer(id: number): Promise<Product[]> {
      return this.em.find(Product, {
         select: {
            ...SIMPLE_PRODUCT_PROPERTIES,
            sellerRating: {
               ...SELLER_RATING_PROPERTIES,
            },
         },
         relations: {
            seller: true,
            sellerRating: true,
         },
         where: {
            highestBidderId: id,
            transactionId: IsNull(),
            expiration: Raw(
               (alias) =>
                  `${alias} <= (date_trunc('day', (now() AT TIME ZONE 'Europe/Budapest')) AT TIME ZONE 'Europe/Budapest')::date`,
            ),
         },
      });
   }
}
