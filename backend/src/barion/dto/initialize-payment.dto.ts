import { IsNumber } from 'class-validator';

export class InitializePaymentDto {
   @IsNumber(undefined, { each: true })
   productIds!: number[];
}
