import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, takeUntil } from 'rxjs';
import { CategoryFilter } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/shared/services/category.service';
import { inverseTransformProperties } from '../../categories/categories.component';

@Component({
   selector: 'app-category-filters',
   templateUrl: './category-filters.component.html',
   styleUrls: ['./category-filters.component.scss'],
})
export class CategoryFiltersComponent implements OnInit, OnDestroy {
   categoryFilters: CategoryFilter[] = [];
   categoryFilterForms: [
      number,
      FormGroup<{
         isAuction: FormControl<boolean | null>;
         price: FormControl<number | null>;
         priceUntil: FormControl<number | null>;
         expireUntil: FormControl<Date | null>;
         startedFrom: FormControl<Date | null>;
         properties: FormGroup<{
            [k: string]: FormControl<string | string[] | null>;
         }>;
      }>,
      [string, { multi: boolean; values: string[] }][],
      string,
   ][] = [];

   destroyed$ = new ReplaySubject<void>(1);

   constructor(
      private fb: FormBuilder,
      private categoryService: CategoryService,
   ) {
      this.categoryService
         .getAllCategoryFilter()
         .pipe(takeUntil(this.destroyed$))
         .subscribe(cfs => {
            this.categoryFilters = cfs;
            this.categoryFilterForms = cfs.map(cf => {
               const categoryProperties = Object.entries(
                  cf.category.properties,
               );
               const propertiesFormGrup = this.fb.group({});

               categoryProperties.forEach(([k, v]) => {
                  propertiesFormGrup.addControl(
                     k,
                     this.fb.control(
                        v.multi ? [] : (null as string | string[] | null),
                     ),
                  );
               });

               propertiesFormGrup.patchValue(
                  inverseTransformProperties(cf.categoryProperties),
               );

               const formGroup = this.fb.group({
                  isAuction: cf.isAuction ?? false,
                  price: cf.price ?? null,
                  priceUntil: cf.priceUntil ?? null,
                  expireUntil:
                     cf.expireUntil == null ? null : new Date(cf.expireUntil),
                  startedFrom:
                     cf.startedFrom == null ? null : new Date(cf.startedFrom),
                  properties: propertiesFormGrup,
               });

               disableForm(formGroup);

               return [cf.id, formGroup, categoryProperties, cf.category.name];
            });
         });
   }

   ngOnInit(): void {}

   ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
   }

   deleteFilter(categoryFilterId: number) {
      this.categoryService
         .deleteCategoryFilter(categoryFilterId)
         .pipe(takeUntil(this.destroyed$))
         .subscribe(() => {
            this.categoryFilterForms = this.categoryFilterForms.flatMap(cff => {
               if (cff[0] === categoryFilterId) {
                  return [];
               }
               return [cff];
            });
         });
   }
}

function disableForm(fg: FormGroup) {
   const controls = [...Object.values(fg.controls)];
   while (controls.length > 0) {
      const control = controls.shift()!;
      control.disable();
      if (control instanceof FormGroup) {
         controls.push(...Object.values(control.controls));
      }
   }
}
