import {
   ForbiddenException,
   Injectable,
   NotFoundException,
} from '@nestjs/common';
import { Role, User } from 'src/user/entities/user.entity';
import { EntityManager } from 'typeorm';
import { CreateCategoryFilterDto } from './dto/create-category-filter.dto';
import { CategoryFilter } from './entities/category-filter.entity';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryFilterService {
   constructor(private em: EntityManager) {}

   getAll(userId: number) {
      return this.em
         .createQueryBuilder(CategoryFilter, 'cf')
         .leftJoinAndMapOne(
            'cf.category',
            Category,
            'c',
            'c.id = cf.categoryId',
         )
         .select(['cf', 'c.id', 'c.name', 'c.properties'])
         .where('cf.userId = :userId', { userId })
         .getMany();
   }

   async create(createCategoryFilter: CreateCategoryFilterDto, userId: number) {
      const { productProperties, ...rest } = createCategoryFilter;

      const categoryFilter = this.em.create(CategoryFilter, {
         ...rest,
         ...productProperties,
         userId,
      });

      return this.em.save(CategoryFilter, categoryFilter);
   }

   async remove(id: number, user: User) {
      const categoryFilter = await this.em.findOne(CategoryFilter, {
         where: { id },
         relations: ['user'],
      });
      if (!categoryFilter) throw new NotFoundException();
      if (user.role === Role.customer && user.id !== categoryFilter.user!.id)
         throw new ForbiddenException();
      return this.em.remove(CategoryFilter, categoryFilter);
   }
}
