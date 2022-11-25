import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import {
   Column,
   Entity,
   JoinColumn,
   ManyToOne,
   OneToMany,
   PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Payment {
   @PrimaryGeneratedColumn()
   id!: number;

   @Column('text', { unique: true })
   paymentId!: string;

   @ManyToOne(() => User, (user) => user.payments, {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
   })
   @JoinColumn({ name: 'buyerId' })
   buyer!: User;

   @Column({ name: 'buyerId' })
   buyerId!: number;

   @OneToMany(() => Product, (product) => product.transaction)
   products!: Product[];
}
