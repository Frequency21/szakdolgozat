import { Product, ProductProperties } from './product.model';

export interface Category {
   id: number;
   name: string;
   properties: CategoryProperties;
   subCategories: Category[];
   parentCategory?: Category;
   products?: Product[];
}

export type CategoryProperties = Record<
   string,
   {
      multi: boolean;
      values: string[];
   }
>;

export interface CreateCategoryDto {
   name: string;
   parentCategoryId?: number;
   properties: CategoryProperties;
}

export interface CreateCategoryFilterDto {
   categoryId?: number;
   productProperties: ProductProperties;
   categoryProperties: CategoryProperties;
}

export interface CategoryFilter extends ProductProperties {
   id: number;
   categoryProperties: CategoryProperties;
   category: Pick<Category, 'id' | 'name' | 'properties'>;
}
