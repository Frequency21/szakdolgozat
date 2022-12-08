import { ApiProperty } from '@nestjs/swagger';

export class SellerRatingStatisticsDto {
   @ApiProperty()
   sum!: number;

   @ApiProperty()
   communication!: number;

   @ApiProperty()
   delivery!: number;

   @ApiProperty()
   transaction!: number;

   @ApiProperty()
   quality!: number;
}
