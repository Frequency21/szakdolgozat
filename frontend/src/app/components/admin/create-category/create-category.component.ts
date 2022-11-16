import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CreateCategoryDto } from 'src/app/models/category.model';
import {
   CategoryService,
   deepCloneCategories,
} from 'src/app/shared/services/category.service';

interface CategoryTreeNode {
   node: {
      data: number;
      label: string;
   };
}

@Component({
   selector: 'app-create-category',
   templateUrl: './create-category.component.html',
   styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit, OnDestroy {
   categoryTreeNode: TreeNode[] = [];
   selectedNodes = [];

   fbNonNull = this.fb.nonNullable;
   createCategoryForm = this.fbNonNull.group({
      parentId: [null as null | number],
      name: ['', [Validators.required]],
      properties: this.fbNonNull.array([
         this.fbNonNull.group({
            key: ['', [Validators.required]],
            multi: [false],
            values: [[] as string[]],
         }),
      ]),
   });

   propertiesControl = this.createCategoryForm.controls.properties;

   destroyed$ = new ReplaySubject<void>(1);

   constructor(
      private fb: FormBuilder,
      private categoryService: CategoryService,
   ) {
      this.categoryService
         .getAllCategory()
         .pipe(takeUntil(this.destroyed$))
         .subscribe(categories => {
            this.categoryTreeNode = deepCloneCategories(
               categories,
               c =>
                  ({
                     label: c.name,
                     data: c.id,
                  } as TreeNode),
               'children',
               true,
            );
         });
   }

   ngOnInit(): void {}

   ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
   }

   onSubmit() {
      console.log(
         'form value',
         JSON.stringify(this.createCategoryForm.value, undefined, 4),
      );
      const value = this.createCategoryForm.value;
      const propertiesAsObject =
         this.createCategoryForm.value.properties!.length === 0
            ? undefined
            : this.createCategoryForm.value.properties!.reduce((prev, curr) => {
                 return {
                    ...prev,
                    [curr.key!]: { values: curr.values, multi: curr.multi },
                 };
              }, {});
      const payload = {
         parentCategoryId: value.parentId ?? undefined,
         name: value.name,
         properties: propertiesAsObject,
      } as CreateCategoryDto;
      this.categoryService.createCategory(payload).subscribe(response => {
         console.log('create category resp', response);
      });
   }

   addProperty() {
      this.propertiesControl.push(
         this.fbNonNull.group({
            key: ['', [Validators.required]],
            multi: [false],
            values: [[] as string[]],
         }),
      );
   }

   deleteProperty(index: number) {
      this.propertiesControl.removeAt(index);
   }

   treeSelect({ node: { data } }: CategoryTreeNode) {
      this.createCategoryForm.controls.parentId.setValue(data);
   }

   onTreeClear() {
      console.log('nodeUnselect');
      this.createCategoryForm.controls.parentId.setValue(null);
   }
}
