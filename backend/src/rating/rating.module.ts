import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BuyerRating } from './entities/buyer-rating.entity';
import { SellerRating } from './entities/seller-rating.entity';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';

@Module({
   imports: [TypeOrmModule.forFeature([SellerRating, BuyerRating]), AuthModule],
   controllers: [RatingController],
   providers: [RatingService],
   exports: [TypeOrmModule, RatingService],
})
export class RatingModule {}
