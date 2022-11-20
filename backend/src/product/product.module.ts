import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AwsModule } from 'src/aws/aws.module';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
   imports: [TypeOrmModule.forFeature([Product]), AwsModule, AuthModule],
   controllers: [ProductController],
   providers: [ProductService],
   exports: [TypeOrmModule, ProductService],
})
export class ProductModule {}
