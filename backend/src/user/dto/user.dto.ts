import { IsBoolean, IsString } from 'class-validator';

export class UserDto {
   @IsString()
   name: string;

   @IsBoolean()
   isActive: boolean;
}
