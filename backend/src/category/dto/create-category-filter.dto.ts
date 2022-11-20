import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
   IsNumber,
   IsOptional,
   Validate,
   ValidateNested,
} from 'class-validator';
import { ProductProperties } from '../entities/category-filter.entity';
import { CategoryProperties } from '../entities/category.entity';
import { PropertiesSchema } from './create-category.dto';

export class CreateCategoryFilterDto {
   @ApiProperty()
   @IsNumber()
   categoryId!: number;

   @ApiPropertyOptional()
   @ValidateNested()
   @IsOptional()
   @Type(() => ProductProperties)
   productProperties?: ProductProperties;

   @ApiPropertyOptional()
   @Validate(PropertiesSchema)
   categoryProperties?: CategoryProperties;
}
