import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import {
   Category,
   CategoryProperties,
   CreateCategoryFilterDto,
} from 'src/app/models/category.model';
import { ProductSimple } from 'src/app/models/product.model';
import { setDateToMidnight } from 'src/app/shared/helpers/date.helper';
import { CategoryService } from 'src/app/shared/services/category.service';
import {
   CategoryFilterDto,
   ProductService,
} from 'src/app/shared/services/product.service';

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
      isAuction: [false],
      price: [null as number | null],
      priceUntil: [null as number | null],
      expireUntil: [null as Date | null],
      startedFrom: [null as Date | null],
      properties: this.fb.nonNullable.group<{
         [k: string]: FormControl<string | string[] | null>;
      }>({}),
   });

   constructor(
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

      this.f.expireUntil.disable();
      this.f.isAuction.valueChanges
         .pipe(takeUntil(this.destroyed$))
         .subscribe(isAuction => {
            if (isAuction) {
               this.f.expireUntil.enable();
            } else {
               this.f.expireUntil.disable();
            }
         });
   }

   ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
   }

   get f() {
      return this.productFilterForm.controls;
   }

   submitFilter() {
      const value = this.productFilterForm.value;
      const categoryFilter: CategoryFilterDto = {
         categoryId: this.category!.id,
         isAuction: value.isAuction! ?? undefined,
         startedFrom: setDateToMidnight(value.startedFrom) ?? undefined,
         expireUntil: setDateToMidnight(value.expireUntil) ?? undefined,
         price: value.price ?? undefined,
         priceUntil: value.priceUntil ?? undefined,
         properties: transformProperties(
            this.productFilterForm.value.properties,
         ),
      };

      this.productService.findWhere(categoryFilter).subscribe(products => {
         this.products = products;
      });
   }

   resetFilter() {
      this.productFilterForm.reset({
         isAuction: false,
      });
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

   saveFilter() {
      const value = this.productFilterForm.value;
      const categoryFilter: CreateCategoryFilterDto = {
         categoryId: this.category!.id,
         productProperties: {
            isAuction: value.isAuction!,
            startedFrom: setDateToMidnight(value.startedFrom) ?? undefined,
            expireUntil: setDateToMidnight(value.expireUntil) ?? undefined,
            price: value.price ?? undefined,
            priceUntil: value.priceUntil ?? undefined,
         },
         categoryProperties: transformProperties(
            this.productFilterForm.value.properties,
         ),
      };

      this.categoryService.createCategoryFilter(categoryFilter).subscribe();
   }
}

// lehetne javítani azzal, hogy az üres arrayeket kifilterezzük
// de a typescript típusok nagyon megőrülnek
/**
 * @param properties properties form control értéke
 * @returns a category categoryProperties sémájának megfelelő adatstruktúra
 */
export function transformProperties(
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

export type PropertiesControl = {
   [k: string]: string[];
};
/**
 * @param properties Category categoryPropertiesnek megfelelő struktúra
 * @returns properties formcontrolnak megfelelő struktúra (patchValuehoz)
 */
export function inverseTransformProperties(
   properties: CategoryProperties,
): PropertiesControl {
   if (!properties) {
   }
   return Object.fromEntries(
      Object.entries(properties).map(([k, v]) => {
         return [k, v.values];
      }),
   );
}
