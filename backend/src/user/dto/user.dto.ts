import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UserDto {
   @ApiProperty()
   @IsNumber()
   public id?: number;

   @ApiProperty()
   @IsEmail()
   public email!: string;

   @ApiProperty()
   @IsString()
   public name!: string;

   @ApiProperty()
   @IsString()
   public password!: string;
}
