import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RippleModule } from 'primeng/ripple';
import { SlideMenuModule } from 'primeng/slidemenu';
import { ToastModule } from 'primeng/toast';

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
];

@NgModule({
   declarations: [],
   imports: [SHARED_MODULES],
   exports: [SHARED_MODULES],
})
export class SharedModule {}
