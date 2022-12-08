import { ApiProperty } from '@nestjs/swagger';

export class BuyerRatingStatisticsDto {
   @ApiProperty()
   sum!: number;

   @ApiProperty()
   communication!: number;

   @ApiProperty()
   delivery!: number;

   @ApiProperty()
   transaction!: number;
}
