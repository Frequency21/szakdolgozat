import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SkeletonModule } from 'primeng/skeleton';
import { SlideMenuModule } from 'primeng/slidemenu';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TreeSelectModule } from 'primeng/treeselect';
import { ProductItemComponent } from '../components/product-item/product-item.component';

const SHARED_MODULES = [
   // Angular
   CommonModule,
   ReactiveFormsModule,
   FormsModule,
   // PrimeNG
   ButtonModule,
   RippleModule,
   InputTextModule,
   InputTextareaModule,
   ToastModule,
   SlideMenuModule,
   DropdownModule,
   DividerModule,
   TreeSelectModule,
   InputSwitchModule,
   ChipsModule,
   CheckboxModule,
   FileUploadModule,
   RadioButtonModule,
   CalendarModule,
   InputNumberModule,
   MultiSelectModule,
   GalleriaModule,
   OverlayPanelModule,
   TableModule,
   BadgeModule,
   RatingModule,
   DialogModule,
   SkeletonModule,
];

const SHARED_COMPONENTS = [ProductItemComponent];

@NgModule({
   declarations: [SHARED_COMPONENTS],
   imports: [SHARED_MODULES],
   exports: [SHARED_MODULES, SHARED_COMPONENTS],
})
export class SharedModule {}
