import { Validate } from 'class-validator';
import { RatingValidator } from '../entities/rating.entity';
import { BuyerRatingDto } from './buyer-rating-dto';

export class SellerRatingDto extends BuyerRatingDto {
   @Validate(RatingValidator)
   quality!: string;
}
