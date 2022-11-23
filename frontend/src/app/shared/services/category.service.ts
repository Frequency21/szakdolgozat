import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import {
   Category,
   CategoryFilter,
   CreateCategoryDto,
   CreateCategoryFilterDto,
} from 'src/app/models/category.model';

/* TODO: lehetne majd mélységi és szélességi korlátozás
pl.: csak 2 mélységig megyünk le, a szélességében
pedig csak a legtöbb terméket tartalmazó kategóriák
jelennének meg! */
function deepCloneTree<T = MenuItem>(
   node: Category,
   mapper: (node: Category) => T,
   childrenKey: keyof T,
   sort = false,
   extraPropertiesForLeaves: Partial<T> = {},
) {
   if (node.subCategories.length === 0) {
      return { ...mapper({ ...node }), ...extraPropertiesForLeaves };
   }

   const newRoot = mapper(node);
   (newRoot[childrenKey] as any) = [];
   const children = !sort
      ? node.subCategories
      : node.subCategories.slice().sort((a, b) => a.name.localeCompare(b.name));
   for (let i = 0; i < children.length; i++) {
      const newChild = deepCloneTree(
         children[i],
         mapper,
         childrenKey,
         sort,
         extraPropertiesForLeaves,
      );
      (newRoot[childrenKey] as any).push(newChild);
   }

   return newRoot;
}

export function deepCloneCategories<T = MenuItem>(
   categories: Category[],
   mapper: (node: Category) => T,
   childrenKey: keyof T,
   sort = false,
   extraPropertiesForLeaves: Partial<T> = {},
) {
   categories = categories.slice();
   if (sort) categories.sort((a, b) => a.name.localeCompare(b.name));
   return categories.map(category =>
      deepCloneTree(
         category,
         mapper,
         childrenKey,
         sort,
         extraPropertiesForLeaves,
      ),
   );
}

@Injectable({
   providedIn: 'root',
})
export class CategoryService {
   constructor(private http: HttpClient) {}

   getAllCategory() {
      return this.http.get<Category[]>('/api/category');
   }

   getCategory(id: number) {
      return this.http.get<Category>(`/api/category/${id}`);
   }

   createCategory(category: CreateCategoryDto) {
      return this.http.post<Category>('/api/category', category);
   }

   deleteCategory(categoryId: number) {
      return this.http.delete<Category>(`/api/category/${categoryId}`);
   }

   createCategoryFilter(createCategoryFilter: CreateCategoryFilterDto) {
      return this.http.post('/api/category-filter', createCategoryFilter);
   }

   getAllCategoryFilter() {
      return this.http.get<CategoryFilter[]>('/api/category-filter');
   }

   deleteCategoryFilter(cfId: number) {
      return this.http.delete(`/api/category-filter/${cfId}`);
   }
}
