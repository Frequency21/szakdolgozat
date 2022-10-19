import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum Delivery {
   personal = 'personal',
   mail = 'mail',
   other = 'other',
}

@Entity()
export class Product {
   @ApiProperty({ example: 1 })
   @PrimaryGeneratedColumn()
   id!: number;

   @ApiProperty({ example: 'karóra' })
   @Column()
   name!: string;

   @ApiProperty({ example: 10_000 })
   @Column()
   price!: number;

   @ApiProperty()
   @Column({ default: false })
   isAuction!: boolean;

   @ApiPropertyOptional()
   @Column({ nullable: true, default: null })
   minBid?: number;

   @ApiPropertyOptional()
   @Column({ nullable: true, default: null })
   minPrice?: number;

   @ApiProperty({ enum: Delivery, default: Delivery.personal })
   @Column('enum', { enum: Delivery, default: Delivery.personal })
   delivery!: Delivery;

   @ApiPropertyOptional()
   @Column({ nullable: true, default: null })
   weight?: number;

   @ApiProperty({ isArray: true })
   @Column('varchar', { array: true })
   pictures?: string[];

   @ApiProperty({ type: () => User })
   @ManyToOne(() => User, (user) => user.products)
   seller?: User;

   @ApiProperty({ type: () => User })
   @ManyToOne(() => User, (user) => user.boughtProducts)
   buyer?: User;

   @ApiProperty({ type: () => Category })
   @ManyToOne(() => Category, (category) => category.products)
   category?: Category;
}
