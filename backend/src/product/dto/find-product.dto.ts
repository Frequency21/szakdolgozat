import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, Validate } from 'class-validator';
import { PropertiesSchema } from 'src/category/dto/create-category.dto';
import { CategoryProperties } from 'src/category/entities/category.entity';

export class FindProductDto {
   @ApiPropertyOptional()
   @IsNumber()
   @IsOptional()
   weight?: number;

   @ApiPropertyOptional()
   @IsDateString()
   @IsOptional()
   expiration?: Date;

   @ApiPropertyOptional()
   @Validate(PropertiesSchema)
   properties!: CategoryProperties;

   @ApiProperty()
   @IsNumber()
   categoryId!: number;
}
