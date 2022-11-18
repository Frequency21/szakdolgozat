import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { SlideMenuModule } from 'primeng/slidemenu';
import { ToastModule } from 'primeng/toast';
import { TreeSelectModule } from 'primeng/treeselect';

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
];

@NgModule({
   declarations: [],
   imports: [SHARED_MODULES],
   exports: [SHARED_MODULES],
})
export class SharedModule {}
