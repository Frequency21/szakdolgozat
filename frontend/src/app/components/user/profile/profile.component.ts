import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MenuItem, TreeNode } from 'primeng/api';
import { switchMap } from 'rxjs';
import { Category } from 'src/app/models/category.model';
import {
   CategoryService,
   deepCloneTree,
} from 'src/app/shared/services/category.service';

@Component({
   selector: 'app-profile',
   templateUrl: './profile.component.html',
   styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
   categoryForm = this.fb.nonNullable.group({
      categoryName: this.fb.nonNullable.control('', [Validators.required]),
      parentCategoryId: this.fb.nonNullable.control(''),
   });

   deleteCategoryForm = this.fb.nonNullable.group({
      categoryId: this.fb.nonNullable.control('', [Validators.required]),
   });

   categoryMenuItems: MenuItem[] = [];
   categoryTreeNode: TreeNode[] = [];

   selectedNodes = [];

   constructor(
      private fb: FormBuilder,
      private categoryService: CategoryService,
   ) {
      this.categoryService.getAllCategory().subscribe(categories => {
         this.categories = categories;
         this.categoryMenuItems = categories
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(category =>
               deepCloneTree(
                  category,
                  c =>
                     ({
                        label: c.name,
                     } as MenuItem),
                  'items',
               ),
            );
         this.categoryTreeNode = categories
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(category =>
               deepCloneTree(
                  category,
                  c =>
                     ({
                        label: c.name,
                        data: c.id,
                     } as TreeNode),
                  'children',
               ),
            );

         console.log(JSON.stringify(this.categoryMenuItems, undefined, 4));
      });
   }

   categories: Category[] = [];

   createCategory() {
      const formValue = this.categoryForm.value;
      this.categoryService
         .createCategory({
            name: formValue.categoryName!,
            parentCategoryId:
               formValue.parentCategoryId === ''
                  ? undefined
                  : Number(formValue.parentCategoryId),
         })
         .pipe(switchMap(() => this.categoryService.getAllCategory()))
         .subscribe(categories => {
            this.categories = categories;
         });
   }

   deleteCategory() {
      this.categoryService
         .deleteCategory(+this.deleteCategoryForm.value.categoryId!)
         .subscribe(console.log.bind(this, 'DELETED CATEGORY'));
   }

   treeSelect(value: any) {
      // console.log(JSON.stringify(value, undefined, 4));
      console.log('value', value);
   }
}
