import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsService } from 'src/aws/aws.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
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

      createProductDto.pictures.map((fileName) => {
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

   findAll() {
      return `This action returns all product`;
   }

   findOne(id: number) {
      return `This action returns a #${id} product`;
   }

   update(id: number, updateProductDto: UpdateProductDto) {
      return `This action updates a #${id} product`;
   }

   remove(id: number) {
      return `This action removes a #${id} product`;
   }
}
