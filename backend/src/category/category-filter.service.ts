import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateCategoryFilterDto } from './dto/create-category-filter.dto';
import { CategoryFilter } from './entities/category-filter.entity';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryFilterService {
   constructor(private em: EntityManager) {}

   async create(createCategoryFilter: CreateCategoryFilterDto, userId: number) {
      const { productProperties, ...rest } = createCategoryFilter;

      const categoryFilter = this.em.create(CategoryFilter, {
         ...rest,
         ...productProperties,
         userId,
      });

      return this.em.save(CategoryFilter, categoryFilter);
   }

   remove(id: number) {
      return this.em.getTreeRepository(Category).delete(id);
   }
}
