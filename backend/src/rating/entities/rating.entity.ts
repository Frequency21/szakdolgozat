import { ApiProperty } from '@nestjs/swagger';
import {
   ValidationArguments,
   ValidatorConstraint,
   ValidatorConstraintInterface,
} from 'class-validator';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Rating {
   @ApiProperty()
   @PrimaryGeneratedColumn()
   id!: number;

   /** Fizetési lehetőségek, fizetési gondok, késések, nem fizetett */
   @ApiProperty()
   @Column()
   transaction!: string;

   /** Átvétel - átadás */
   @ApiProperty()
   @Column()
   delivery!: string;

   /** kapcsolatfelvétel, kommunikáció */
   @ApiProperty()
   @Column()
   communication!: string;
}

@ValidatorConstraint({ name: 'rating', async: false })
export class RatingValidator implements ValidatorConstraintInterface {
   readonly ACCEPTABLE_RATINGS = ['1', '2', '3', '4', '5'];

   validate(rating: unknown, _args: ValidationArguments) {
      if (typeof rating !== 'string') return false;

      return this.ACCEPTABLE_RATINGS.includes(rating);
   }

   defaultMessage(_args: ValidationArguments) {
      return '$property must be a string integer from 1 to 5';
   }
}
