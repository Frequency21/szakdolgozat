import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
   constructor(private em: EntityManager) {}

   async create(createCategoryDto: CreateCategoryDto) {
      const newCategory = new Category();
      newCategory.name = createCategoryDto.name;
      if (createCategoryDto.parentCategoryId) {
         const parent = await this.em.getTreeRepository(Category).findOneBy({
            id: createCategoryDto.parentCategoryId,
         });
         if (!parent) {
            throw new NotFoundException({
               message: 'Not found parent category',
            });
         }
         newCategory.parentCategory = parent;
      }
      return this.em.getTreeRepository(Category).save(newCategory);
   }

   findAll() {
      return this.em.getTreeRepository(Category).findTrees();
   }

   findOne(id: number) {
      return `This action returns a #${id} category`;
   }

   update(id: number, updateCategoryDto: UpdateCategoryDto) {
      return `This action updates a #${id} category`;
   }

   remove(id: number) {
      return this.em.getTreeRepository(Category).delete(id);
   }
}
