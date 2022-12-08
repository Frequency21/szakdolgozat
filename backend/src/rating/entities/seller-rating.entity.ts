import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Rating } from './rating.entity';

@Entity('seller_ratings')
export class SellerRating extends Rating {
   /** Áru minősége */
   @ApiProperty()
   @Column()
   quality!: string;

   @ApiProperty({ type: () => Product })
   @OneToOne(() => Product, (product) => product.sellerRating, {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
   })
   @JoinColumn({ name: 'productId' })
   product!: Product;

   @ApiProperty()
   @Column({ name: 'productId' })
   productId!: number;
}
