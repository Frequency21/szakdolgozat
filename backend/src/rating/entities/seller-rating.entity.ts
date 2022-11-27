import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Rating } from './rating.entity';

@Entity('seller_ratings')
export class SellerRating extends Rating {
   /** Áru minősége */
   @Column()
   quality!: string;

   @OneToOne(() => Product, (product) => product.sellerRating, {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
   })
   @JoinColumn({ name: 'productId' })
   product!: Product;

   @Column({ name: 'productId' })
   productId!: number;
}
