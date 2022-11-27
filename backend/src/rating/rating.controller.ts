import { Body, Controller, Post } from '@nestjs/common';
import { BuyerRatingDto } from './dto/buyer-rating-dto';
import { SellerRatingDto } from './dto/seller-rating.dto';
import { RatingService } from './rating.service';

@Controller('rating')
export class RatingController {
   constructor(private ratingService: RatingService) {}

   @Post('seller')
   sellerRating(@Body() sellerRating: SellerRatingDto): Promise<void> {
      return this.ratingService.sellerRating(sellerRating);
   }

   @Post('buyer')
   buyerRatingForUser(@Body() buyerRating: BuyerRatingDto): Promise<void> {
      return this.ratingService.buyerRating(buyerRating);
   }
}
