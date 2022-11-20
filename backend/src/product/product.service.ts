import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/aws/aws.service';
import { CREATED_PRODUCT_EVENT } from 'src/events/created-product.event';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
   logger = new Logger(ProductService.name);

   constructor(
      @InjectRepository(Product)
      private readonly productRepo: Repository<Product>,
      private readonly awsService: AwsService,
      private eventEmitter: EventEmitter2,
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
            price: true,
            pictures: true,
            condition: true,
            expiration: true,
            isAuction: true,
         },
         where: {
            ...(categoryId == null ? {} : { categoryId }),
         },
         relations: ['seller'],
      });
   }

   findOne(id: number) {
      return this.productRepo.findOneOrFail({
         where: {
            id,
         },
         relations: { seller: true },
      });
   }

   findWhere(findProductDto: FindProductDto): Promise<Product[]> {
      const sql = this.productRepo
         .createQueryBuilder('p')
         // .select('*')
         .leftJoinAndMapOne('p.seller', User, 'u', 'u.id = p.sellerId')
         .where('p.properties @> :props::jsonb', {
            props: findProductDto.properties,
         })
         .andWhere('p.categoryId = :categoryId', {
            categoryId: findProductDto.categoryId,
         });

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

   update(id: number, updateProductDto: UpdateProductDto) {
      return `This action updates a #${id} product`;
   }

   remove(id: number) {
      return `This action removes a #${id} product`;
   }
}
