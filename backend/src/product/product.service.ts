import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/aws/aws.service';
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

      await this.productRepo.save(createProductDto);
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
         // .where('p.properties @> :props::jsonb', {
         //    props: {
         //       szín: {
         //          multi: true,
         //          values: ['fehér'],
         //       },
         //       háziasított: {
         //          multi: false,
         //          values: [],
         //       },
         //       aktivitás: {
         //          multi: false,
         //          values: [],
         //       },
         //    },
         // })
         .andWhere('p.categoryId = :categoryId', {
            categoryId: findProductDto.categoryId,
         });

      // console.log(sql.getQueryAndParameters());
      console.log(JSON.stringify(sql.getQueryAndParameters(), null, 4));

      return sql.getMany();
   }

   update(id: number, updateProductDto: UpdateProductDto) {
      return `This action updates a #${id} product`;
   }

   remove(id: number) {
      return `This action removes a #${id} product`;
   }
}
