import { IsNumber, IsOptional, Validate } from 'class-validator';
import { RatingValidator } from '../entities/rating.entity';

export class BuyerRatingDto {
   @IsNumber()
   @IsOptional()
   id?: number;

   @IsNumber()
   productId!: number;

   @Validate(RatingValidator)
   transaction!: string;

   @Validate(RatingValidator)
   delivery!: string;

   @Validate(RatingValidator)
   communication!: string;
}
