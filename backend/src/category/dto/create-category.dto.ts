import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto extends PickType(Category, ['name']) {
   @ApiPropertyOptional({ example: 1 })
   @IsNumber()
   @IsOptional()
   parentCategoryId?: number;
}
