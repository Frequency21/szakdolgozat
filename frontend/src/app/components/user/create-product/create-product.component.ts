import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api';
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
      pictures: [[] as string[]],
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
      sellerId: [null as number | null],
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
      // console.log(event);
      this.chosenFiles = event.files;
      // this.awsService
      //    .getSignedUrls(event.files.map(f => f.name))
      //    .subscribe(() => {});

      const createProductDto: CreateProductDto = {
         categoryId: this.productForm.value.categoryId!,
         condition: this.productForm.value.condition!,
         deliveryOptions: this.productForm.value.deliveryOptions!,
         description: this.productForm.value.description!,
         isAuction: this.productForm.value.isAuction!,
         name: this.productForm.value.name!,
         pictures: this.chosenFiles.map(file => file.name),
         price: this.productForm.value.price!,
         properties: transformProperties(this.productForm.value.properties!),
         sellerId: this.productForm.value.sellerId!,
         expiration: this.productForm.value.expiration ?? undefined,
         minBid: this.productForm.value.minBid ?? undefined,
         minPrice: this.productForm.value.minPrice ?? undefined,
         weight: this.productForm.value.weight ?? undefined,
      };

      // console.log(createProductDto);
      this.productService
         .createProduct(createProductDto)
         .pipe(
            concatMap(fileUploadData => {
               this.productForm.reset({});
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
   }

   treeSelect({ node: { data } }: any) {
      this.categoryService.getCategory(data).subscribe(category => {
         this.f.categoryId.setValue(category.id);
         Object.keys(this.f.properties.value).forEach(name => {
            (this.f.properties as any).removeControl(name);
         });

         this.selectedCategoryProperties = Object.entries(category.properties);
         this.selectedCategoryProperties.forEach(([k]) => {
            this.productForm.controls.properties.addControl(
               k,
               this.fb.control(null as string | string[] | null, [
                  Validators.required,
               ]),
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
               values: [v],
            },
         ];
      }),
   );
}
