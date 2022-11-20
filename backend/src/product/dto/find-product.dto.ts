import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsNumber, Validate } from 'class-validator';
import { PropertiesSchema } from 'src/category/dto/create-category.dto';
import { ProductProperties } from 'src/category/entities/category-filter.entity';
import { CategoryProperties } from 'src/category/entities/category.entity';

export class FindProductDto extends PickType(ProductProperties, [
   'expireUntil',
   'isAuction',
   'price',
   'priceUntil',
   'startedFrom',
] as const) {
   @ApiPropertyOptional()
   @Validate(PropertiesSchema)
   properties!: CategoryProperties;

   @ApiProperty()
   @IsNumber()
   categoryId!: number;
}
