import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
   Category,
   CategoryProperties,
} from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import {
   Column,
   Entity,
   Index,
   JoinColumn,
   ManyToMany,
   ManyToOne,
   PrimaryGeneratedColumn,
} from 'typeorm';

export enum Delivery {
   personal = 'personal',
   mail = 'mail',
   other = 'other',
}

export enum Condition {
   new = 'new',
   used = 'used',
   other = 'other',
}

@Entity()
@Index('PRODUCT_PROPERTIES_INDEX', { synchronize: false })
export class Product {
   @ApiProperty({ example: 1 })
   @PrimaryGeneratedColumn()
   id!: number;

   @ApiProperty({ example: 'karóra' })
   @Column()
   name!: string;

   @ApiProperty()
   @Column('text')
   description!: string;

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

   @ApiProperty({ enum: Delivery, isArray: true, default: Delivery.personal })
   @Column('enum', { enum: Delivery, array: true, default: [] })
   deliveryOptions!: Delivery[];

   @ApiProperty({ enum: Condition })
   @Column('enum', { enum: Condition })
   condition!: Condition;

   @ApiPropertyOptional()
   @Column('real', { nullable: true, default: null })
   weight?: number;

   @ApiProperty({ isArray: true })
   @Column('varchar', { array: true, default: [] })
   pictures!: string[];

   @ApiPropertyOptional()
   @Column('date', { nullable: true, default: null })
   expiration?: Date;

   @Column('jsonb', { default: {} })
   properties!: CategoryProperties;

   @ApiProperty({ type: () => User })
   @ManyToOne(() => User, (user) => user.products)
   seller!: User;

   @ApiProperty()
   @Column({ name: 'sellerId' })
   sellerId!: number;

   @ApiProperty({ type: () => User })
   @ManyToOne(() => User, (user) => user.boughtProducts, { nullable: true })
   @JoinColumn({ name: 'buyerId' })
   buyer?: User;

   @ApiPropertyOptional()
   @Column({ name: 'buyerId', nullable: true })
   buyerId?: number;

   @ApiProperty({ type: () => [User] })
   @ManyToMany(() => User, (user) => user.baskets)
   basketOwners?: User[];

   @ApiProperty({ type: () => Category })
   @ManyToOne(() => Category, (category) => category.products)
   @JoinColumn({ name: 'categoryId' })
   category!: Category;

   @ApiProperty()
   @Column({ name: 'categoryId' })
   categoryId!: number;
}
