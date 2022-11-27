import { IsNumber } from 'class-validator';

export class BidDto {
   @IsNumber()
   newPrice!: number;

   @IsNumber()
   productId!: number;
}
