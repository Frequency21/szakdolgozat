import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileComponent } from './profile.component';

@NgModule({
   declarations: [ProfileComponent],
   imports: [SharedModule, CommonModule],
})
export class ProfileModule {}
