import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Payment } from 'src/barion/entities/payment.entity';
import {
   Category,
   CategoryProperties,
} from 'src/category/entities/category.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { BuyerRating } from 'src/rating/entities/buyer-rating.entity';
import { SellerRating } from 'src/rating/entities/seller-rating.entity';
import { User } from 'src/user/entities/user.entity';
import {
   Column,
   CreateDateColumn,
   Entity,
   Index,
   JoinColumn,
   ManyToMany,
   ManyToOne,
   OneToMany,
   OneToOne,
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

   @CreateDateColumn({ name: 'created_date', type: 'date' })
   createdDate!: string;

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
   @Column({ type: 'int4', nullable: true })
   minBid!: number | null;

   @ApiPropertyOptional()
   @Column({ type: 'int4', nullable: true })
   minPrice!: number | null;

   @ApiProperty({ enum: Delivery, isArray: true, default: Delivery.personal })
   @Column('enum', { enum: Delivery, array: true, default: [] })
   deliveryOptions!: Delivery[];

   @ApiProperty({ enum: Condition })
   @Column('enum', { enum: Condition })
   condition!: Condition;

   @ApiPropertyOptional()
   @Column('real', { nullable: true })
   weight!: number | null;

   @ApiProperty({ isArray: true })
   @Column('varchar', { array: true, default: [] })
   pictures!: string[];

   @ApiPropertyOptional()
   @Column('date', { nullable: true })
   expiration!: string | null;

   @Column('jsonb', { default: {} })
   properties!: CategoryProperties;

   @ApiProperty({ type: () => User })
   @ManyToOne(() => User, (user) => user.products)
   seller!: User;

   @ApiProperty()
   @Column({ name: 'sellerId' })
   sellerId!: number;

   @ApiProperty({ type: () => [User] })
   @ManyToMany(() => User, (user) => user.baskets, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
   })
   basketOwners?: User[];

   @ApiProperty({ type: () => Category })
   @ManyToOne(() => Category, (category) => category.products)
   @JoinColumn({ name: 'categoryId' })
   category!: Category;

   @ApiProperty()
   @Column({ name: 'categoryId' })
   categoryId!: number;

   @ApiPropertyOptional({ type: [Notification], default: [] })
   @OneToMany(() => Notification, (notification) => notification.product)
   notifications?: Notification[];

   @ManyToOne(() => Payment, (payment) => payment.products, {
      nullable: true,
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
   })
   @JoinColumn({ name: 'transactionId' })
   transaction?: Payment;

   @Column({ type: 'int4', name: 'transactionId', nullable: true })
   transactionId!: number | null;

   @ManyToOne(() => User, (user) => user.biddenProducts, { nullable: true })
   @JoinColumn({ name: 'highestBidderId' })
   highestBidder?: User | null;

   @Column({ type: 'int4', name: 'highestBidderId', nullable: true })
   highestBidderId!: number | null;

   @OneToOne(() => BuyerRating, (rating) => rating.product)
   buyerRating?: BuyerRating;

   @OneToOne(() => SellerRating, (rating) => rating.product)
   sellerRating?: SellerRating;
}
