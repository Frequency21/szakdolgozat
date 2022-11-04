import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMessageDto {
   @ApiProperty({ example: 'Hello World!' })
   @IsString()
   text!: string;
}
