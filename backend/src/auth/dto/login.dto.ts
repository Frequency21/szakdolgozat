import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
   @ApiProperty({ example: 'asd@gmail.com' })
   @IsEmail()
   email!: string;

   @ApiProperty({ example: 'asd' })
   @IsString()
   password!: string;
}
