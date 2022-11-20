import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryFilterController } from './category-filter.controller';
import { CategoryFilterService } from './category-filter.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryFilter } from './entities/category-filter.entity';
import { Category } from './entities/category.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Category, CategoryFilter]), AuthModule],
   controllers: [CategoryController, CategoryFilterController],
   providers: [CategoryService, CategoryFilterService],
   exports: [TypeOrmModule],
})
export class CategoryModule {}
