import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BuyerRatingDto } from './dto/buyer-rating-dto';
import { SellerRatingDto } from './dto/seller-rating.dto';
import { BuyerRating } from './entities/buyer-rating.entity';
import { SellerRating } from './entities/seller-rating.entity';

@Injectable()
export class RatingService {
   constructor(private em: EntityManager) {}

   async buyerRating(buyerRating: BuyerRatingDto) {
      await this.em.save(BuyerRating, buyerRating);
   }

   async sellerRating(sellerRating: SellerRatingDto) {
      await this.em.save(SellerRating, sellerRating);
   }
}
