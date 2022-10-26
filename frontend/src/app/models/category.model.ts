import { Product } from './product.model';

export interface Category {
   id: number;
   name: string;
   subCategories: Category[];
   parentCategory?: Category;
   products?: Product[];
}

export interface CreateCategoryDto {
   name: string;
   parentCategoryId?: number;
}
