import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

const SHARED_MODULES = [
   // Angular
   CommonModule,
   // PrimeNG
   ButtonModule,
   InputTextModule,
];

@NgModule({
   declarations: [],
   imports: [SHARED_MODULES],
   exports: [SHARED_MODULES],
})
export class SharedModule {}
