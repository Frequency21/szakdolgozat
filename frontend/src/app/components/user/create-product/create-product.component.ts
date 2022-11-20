import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MessageService, TreeNode } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import {
   concatMap,
   filter,
   forkJoin,
   ReplaySubject,
   takeUntil,
   throwError,
} from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CategoryProperties } from 'src/app/models/category.model';
import {
   Condition,
   CreateProductDto,
   Delivery,
} from 'src/app/models/product.model';
import { setDateToMidnight } from 'src/app/shared/helpers/date.helper';
import {
   CategoryService,
   deepCloneCategories,
} from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
   selector: 'app-create-product',
   templateUrl: './create-product.component.html',
   styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent implements OnDestroy {
   @ViewChild(FileUpload) fileUploadComp!: FileUpload;
   uploadedFiles: any[] = [];
   chosenFiles: File[] = [];
   categoryTreeNode: TreeNode[] = [];

   productForm = this.fb.nonNullable.group({
      name: ['', [Validators.required]],
      categoryId: [null as number | null],
      description: ['', [Validators.required]],
      properties: this.fb.nonNullable.group<{
         [k: string]: FormControl<string | string[] | null>;
      }>({}),
      isAuction: [false],
      price: [null as number | null, [Validators.required]],
      expiration: [null as Date | null, [Validators.required]],
      minBid: [null as number | null, [Validators.required]],
      minPrice: [null as number | null, [Validators.required]],
      condition: ['' as Condition, [Validators.required]],
      deliveryOptions: [[] as Delivery[], [Validators.required]],
      weight: [null as number | null],
      // hidden input field, authServicetől fetchelt userId-val töltjük fel
      sellerId: [null as number | null, [Validators.required]],
   });

   displayCondition: Record<Condition, string> = {
      [Condition.new]: 'Új',
      [Condition.other]: 'Egyéb',
      [Condition.used]: 'Használt',
   };
   conditionOptions = Object.keys(Condition).map(k => ({
      label: (this.displayCondition as any)[k],
      value: k,
   }));

   displayDelivery: Record<Delivery, string> = {
      [Delivery.mail]: 'Posta',
      [Delivery.personal]: 'Személyes átvétel',
      [Delivery.other]: 'Egyéb',
   };
   deliveryOptions = Object.keys(Delivery).map(k => ({
      label: (this.displayDelivery as any)[k],
      value: k,
   }));

   selectedCategoryProperties?: [
      string,
      { multi: boolean; values: string[] },
   ][];

   destroyed$ = new ReplaySubject<void>(1);

   constructor(
      private fb: FormBuilder,
      private categoryService: CategoryService,
      private productService: ProductService,
      private authService: AuthService,
      private httpClient: HttpClient,
   ) {
      const controls = this.productForm.controls;
      this.authService.user$
         .pipe(
            takeUntil(this.destroyed$),
            filter(user => user != null),
         )
         .subscribe(user => {
            this.productForm.patchValue({ sellerId: user!.id });
         });

      controls.minBid.disable();
      controls.minPrice.disable();
      controls.expiration.disable();
      controls.isAuction.valueChanges.subscribe(isAuction => {
         if (isAuction) {
            controls.minBid.enable();
            controls.minPrice.enable();
            controls.expiration.enable();
         } else {
            controls.minBid.disable();
            controls.minPrice.disable();
            controls.expiration.disable();
         }
      });

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
                     selectable: false,
                  } as TreeNode),
               'children',
               true,
               { selectable: true } as TreeNode,
            );
         });
   }

   ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
   }

   myUploader(event: { files: File[] }) {
      if (this.productForm.invalid) {
         this.productForm.markAsDirty();
         this.productForm.markAllAsTouched();
         return;
      }
      this.chosenFiles = event.files;
      const value = this.productForm.value;
      const expiration = setDateToMidnight(value.expiration);

      const createProductDto: CreateProductDto = {
         categoryId: value.categoryId!,
         condition: value.condition!,
         deliveryOptions: value.deliveryOptions!,
         description: value.description!,
         isAuction: value.isAuction!,
         name: value.name!,
         pictures: this.chosenFiles.map(file => file.name),
         price: value.price!,
         properties: transformProperties(value.properties!),
         sellerId: value.sellerId!,
         expiration: expiration ?? undefined,
         minBid: value.minBid ?? undefined,
         minPrice: value.minPrice ?? undefined,
         weight: value.weight ?? undefined,
      };

      this.productService
         .createProduct(createProductDto)
         .pipe(
            concatMap(fileUploadData => {
               this.fileUploadComp.clear();
               this.productForm.reset({
                  sellerId: this.productForm.value.sellerId,
               });
               this.onTreeClear();
               return forkJoin(
                  fileUploadData.map(fileUpload => {
                     const body = this.chosenFiles.find(
                        file => file.name === fileUpload.name,
                     );
                     if (!body)
                        return throwError(
                           () =>
                              new Error(
                                 'Sikeres hírdetés feladás, de sikertelen fájl feltöltés, ' +
                                    'kérlek módosítsd meglévő hírdetésed a "hírdetéseim" menüpontban',
                              ),
                        );
                     return this.httpClient.put(fileUpload.signedUrl, body);
                  }),
               );
            }),
         )
         .subscribe();
   }

   selectedValues = [];

   onTreeClear() {
      this.f.categoryId.reset();
      Object.keys(this.f.properties.value).forEach(name => {
         (this.f.properties as any).removeControl(name);
      });
      this.selectedCategoryProperties = [];
   }

   treeSelect({ node: { data } }: any) {
      this.categoryService.getCategory(data).subscribe(category => {
         this.f.categoryId.setValue(category.id);
         Object.keys(this.f.properties.value).forEach(name => {
            (this.f.properties as any).removeControl(name);
         });

         this.selectedCategoryProperties = Object.entries(category.properties);
         this.selectedCategoryProperties.forEach(([k, v]) => {
            this.productForm.controls.properties.addControl(
               k,
               this.fb.control(
                  v.multi ? [] : (null as string | string[] | null),
                  [Validators.required],
               ),
            );
         });
      });
   }

   get f() {
      return this.productForm.controls;
   }

   submitForm() {
      // meghívjuk a feltöltés komponens feltöltés funkcióját,
      // ami először megpróbálja a backenden létrehozni a terméket,
      // amennyiben ez sikeres, akkor feltölti aws-re a fotókat.
      this.fileUploadComp.upload();
   }
}

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
