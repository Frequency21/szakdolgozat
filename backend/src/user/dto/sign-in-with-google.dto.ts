import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class GoogleSignInDto {
   @ApiProperty()
   @IsJWT()
   jwt!: string;
}
