import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, map, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { Category, CategoryProperties } from 'src/app/models/category.model';
import { DISPLAY_CONDITION, ProductSimple } from 'src/app/models/product.model';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
   selector: 'app-categories',
   templateUrl: './categories.component.html',
   styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit, OnDestroy {
   products?: ProductSimple[];
   category?: Category;
   properties?: [string, { multi: boolean; values: string[] }][];

   productFilterForm = this.fb.nonNullable.group({
      properties: this.fb.nonNullable.group<{
         [k: string]: FormControl<string | string[] | null>;
      }>({}),
   });

   displayCondition = DISPLAY_CONDITION;

   constructor(
      private router: Router,
      private route: ActivatedRoute,
      private productService: ProductService,
      private categoryService: CategoryService,
      private fb: FormBuilder,
   ) {}

   destroyed$ = new ReplaySubject<void>(1);

   ngOnInit(): void {
      this.route.paramMap
         .pipe(
            takeUntil(this.destroyed$),
            map(paramMap => +paramMap.get('id')!),
            switchMap(categoryId => {
               return forkJoin({
                  products:
                     this.productService.getSimpleProductsForCategory(
                        categoryId,
                     ),
                  category: this.categoryService.getCategory(categoryId),
               });
            }),
            takeUntil(this.destroyed$),
         )
         .subscribe(({ products, category }) => {
            this.products = products;
            this.category = category;

            Object.keys(this.f.properties.value).forEach(name => {
               (this.f.properties as any).removeControl(name);
            });

            this.properties = Object.entries(category.properties);
            this.properties.forEach(([k, v]) => {
               this.f.properties.addControl(
                  k,
                  this.fb.control(
                     v.multi ? [] : (null as string | string[] | null),
                  ),
               );
            });
         });
   }

   ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
   }

   navigateToProduct(id: number) {
      this.router.navigate(['product', id]);
   }

   get f() {
      return this.productFilterForm.controls;
   }

   submitFilter() {
      this.productService
         .findWhere({
            categoryId: this.category!.id,
            properties: transformProperties(
               this.productFilterForm.value.properties,
            ),
         })
         .subscribe(products => {
            // console.log(products);
            this.products = products;
         });
   }

   resetFilter() {
      this.productFilterForm.reset();
      if (!this.properties) return;
      console.log(this.productFilterForm.controls);
      Object.entries(this.properties).forEach(
         ([k, [propName, { multi, values }]]) => {
            if (multi) {
               this.productFilterForm.controls.properties.controls[
                  propName
               ].setValue([]);
            }
         },
      );
   }
}

// lehetne javítani azzal, hogy az üres arrayeket kifilterezzük
// de a typescript típusok nagyon megőrülnek
function transformProperties(
   properties:
      | {
           [k: string]: string | string[] | undefined | null;
        }
      | undefined,
): CategoryProperties {
   if (!properties) return {};
   return Object.fromEntries(
      Object.entries(properties).map(([k, v]) => {
         if (Array.isArray(v)) {
            return [
               k,
               {
                  multi: true,
                  values: v,
               },
            ];
         }
         return [
            k,
            {
               multi: false,
               values: v == null ? [] : [v],
            },
         ];
      }),
   );
}
