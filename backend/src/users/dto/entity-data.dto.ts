import { IsString } from 'class-validator';

export class EntityDataDto {
   @IsString()
   email: string;

   @IsString()
   password: string;
}
