import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
   IsNumber,
   IsOptional,
   IsString,
   Validate,
   ValidationArguments,
   ValidatorConstraint,
   ValidatorConstraintInterface,
} from 'class-validator';
import { CategoryProperties } from '../entities/category.entity';

// TODO: lehetne szabályozni hány propertyt és ezeknek maximum hány értéket
// engedélyezünk
@ValidatorConstraint({ name: 'propertiesSchema', async: false })
export class PropertiesSchema implements ValidatorConstraintInterface {
   validate(properties: Record<string, any>, _args: ValidationArguments) {
      if (properties == null) return true;
      for (const v of Object.values(properties)) {
         if (typeof v.multi !== 'boolean') false;
         const values = v.values;
         if (!Array.isArray(values)) return false;
         values.forEach((value) => {
            if (typeof value !== 'string') return;
         });
      }
      return true;
   }

   defaultMessage(_args: ValidationArguments) {
      return 'Bad schema for properties';
   }
}

export class CreateCategoryDto {
   @ApiPropertyOptional({ example: 1 })
   @IsNumber()
   @IsOptional()
   parentCategoryId?: number;

   @ApiProperty({ example: 'Cloths and accessories' })
   @IsString()
   name!: string;

   @ApiPropertyOptional()
   @Validate(PropertiesSchema)
   properties?: CategoryProperties;
}
