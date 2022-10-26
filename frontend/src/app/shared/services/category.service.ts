import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Category, CreateCategoryDto } from 'src/app/models/category.model';

/* TODO: lehetne majd mélységi és szélességi korlátozás
pl.: csak 2 mélységig megyünk le, a szélességében
pedig csak a legtöbb terméket tartalmazó kategóriák
jelennének meg! */
export function deepCloneTree<T = MenuItem>(
   category: Category,
   mapper: (node: Category) => T,
   childrenKey: keyof T,
   sort = false,
) {
   if (category.subCategories.length === 0) {
      return mapper(category);
   }

   const newRoot = mapper(category);
   (newRoot[childrenKey] as any) = [];
   const children = !sort
      ? category.subCategories
      : category.subCategories
           .slice()
           .sort((a, b) => a.name.localeCompare(b.name));
   for (let i = 0; i < children.length; i++) {
      const newChild = deepCloneTree(children[i], mapper, childrenKey);
      (newRoot[childrenKey] as any).push(newChild);
   }

   return newRoot;
}

@Injectable({
   providedIn: 'root',
})
export class CategoryService {
   constructor(private http: HttpClient) {}

   getAllCategory() {
      return this.http.get<Category[]>('/api/category');
   }

   createCategory(category: CreateCategoryDto) {
      return this.http.post<Category>('/api/category', category);
   }

   deleteCategory(categoryId: number) {
      return this.http.delete<Category>(`/api/category/${categoryId}`);
   }
}
