import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
   @ApiProperty({ example: 1 })
   @IsNumber()
   receiverId!: number;

   @ApiProperty({ example: 'Hello World!' })
   @IsString()
   message!: string;
}
