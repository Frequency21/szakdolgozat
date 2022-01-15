import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';

const SHARED_MODULES = [
   // Angular
   CommonModule,
   ReactiveFormsModule,
   // PrimeNG
   ButtonModule,
   RippleModule,
   InputTextModule,
   ToastModule,
];

@NgModule({
   declarations: [],
   imports: [SHARED_MODULES],
   exports: [SHARED_MODULES],
})
export class SharedModule {}
