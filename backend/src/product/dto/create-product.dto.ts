import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
   IsBoolean,
   IsDateString,
   IsEnum,
   IsNotEmpty,
   IsNumber,
   IsOptional,
   IsString,
   Validate,
} from 'class-validator';
import { PropertiesSchema } from 'src/category/dto/create-category.dto';
import { CategoryProperties } from 'src/category/entities/category.entity';
import { Condition, Delivery } from '../entities/product.entity';

export class CreateProductDto {
   @ApiProperty({ example: 'karóra' })
   @IsString()
   name!: string;

   @ApiProperty({ example: 'karóra' })
   @IsString()
   description!: string;

   @ApiProperty({ example: 10_000 })
   @IsNumber()
   price!: number;

   @ApiProperty()
   @IsBoolean()
   isAuction!: boolean;

   @ApiPropertyOptional()
   @IsNumber()
   @IsOptional()
   minBid?: number;

   @ApiPropertyOptional()
   @IsNumber()
   @IsOptional()
   minPrice?: number;

   @ApiProperty({ enum: [Delivery], default: Delivery.personal })
   @IsEnum(Delivery, { each: true })
   deliveryOptions!: Delivery[];

   @ApiProperty({ enum: Condition })
   @IsEnum(Condition)
   condition!: Condition;

   @ApiPropertyOptional()
   @IsNumber()
   @IsOptional()
   weight?: number;

   @ApiProperty({ isArray: true })
   @IsNotEmpty()
   @IsString({ each: true })
   pictures!: string[];

   @ApiPropertyOptional()
   @IsDateString()
   @IsOptional()
   expiration?: Date;

   @ApiPropertyOptional()
   @Validate(PropertiesSchema)
   properties!: CategoryProperties;

   @ApiProperty()
   @IsNumber()
   sellerId!: number;

   @ApiProperty()
   @IsNumber()
   categoryId!: number;
}
