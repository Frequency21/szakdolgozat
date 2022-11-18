import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from 'src/aws/aws.module';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
   imports: [TypeOrmModule.forFeature([Product]), AwsModule],
   controllers: [ProductController],
   providers: [ProductService],
   exports: [TypeOrmModule, ProductService],
})
export class ProductModule {}
