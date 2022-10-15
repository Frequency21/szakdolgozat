import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import {
   Column,
   Entity,
   JoinColumn,
   ManyToOne,
   OneToOne,
   PrimaryGeneratedColumn,
} from 'typeorm';

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

   @Column({ default: false })
   isAuction!: boolean;

   @ApiPropertyOptional()
   @Column({ nullable: true, default: null })
   minBid?: number;

   @ApiPropertyOptional()
   @Column({ nullable: true, default: null })
   minPrice?: number;

   @Column('enum', { enum: Delivery, default: Delivery.personal })
   delivery!: Delivery;

   @ApiPropertyOptional()
   @Column({ nullable: true, default: null })
   weight?: number;

   @ApiProperty()
   @Column('varchar', { array: true })
   pictures?: string[];

   @ApiProperty({ type: () => User })
   @ManyToOne(() => User, (user) => user.products)
   seller?: User;

   @ApiProperty({ type: () => User })
   @ManyToOne(() => User, (user) => user.boughtProducts)
   buyer?: User;

   @ApiProperty({ type: () => Category })
   @OneToOne(() => Category, (category) => category.product)
   @JoinColumn()
   category?: Category;
}
