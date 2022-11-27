import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Rating } from './rating.entity';

@Entity('buyer_ratings')
export class BuyerRating extends Rating {
   @OneToOne(() => Product, (product) => product.buyerRating, {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
   })
   @JoinColumn({ name: 'productId' })
   product!: Product;

   @Column({ name: 'productId' })
   productId!: number;
}
