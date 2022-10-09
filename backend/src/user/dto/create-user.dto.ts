import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
   @ApiProperty({ example: 'asd@gmail.com' })
   @IsEmail()
   email!: string;

   @ApiProperty({ example: 'John Doe' })
   @IsNotEmpty()
   @IsString()
   name!: string;

   @ApiProperty({ example: 'asd' })
   @IsNotEmpty()
   @IsString()
   password!: string;
}
