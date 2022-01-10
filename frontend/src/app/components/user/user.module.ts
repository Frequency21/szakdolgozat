import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';

@NgModule({
   declarations: [UserComponent],
   imports: [
      CommonModule,
      UserRoutingModule,
      ButtonModule,
      FormsModule,
      ReactiveFormsModule,
      InputTextModule,
   ],
})
export class UserModule {}
