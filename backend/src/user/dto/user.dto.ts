import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UserDto {
   @IsNumber()
   public id?: number;

   @IsEmail()
   public email!: string;

   @IsString()
   public name!: string;

   @IsString()
   public password!: string;
}
