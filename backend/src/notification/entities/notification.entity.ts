import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import {
   Column,
   CreateDateColumn,
   Entity,
   Index,
   JoinColumn,
   ManyToOne,
   PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['userId'])
export class Notification {
   @ApiProperty({ example: 1 })
   @PrimaryGeneratedColumn()
   id!: number;

   @ApiProperty()
   @CreateDateColumn({ type: 'date' })
   createdDate!: string;

   @ApiProperty({ example: false })
   @Column()
   seen!: boolean;

   @ManyToOne(() => User, (user) => user.notifications, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
   })
   @JoinColumn({ name: 'userId' })
   user?: User;

   @Column('integer', { name: 'userId' })
   userId!: number;

   @ManyToOne(() => Product, (product) => product.notifications, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
   })
   @JoinColumn({ name: 'productId' })
   product?: Product;

   @Column('integer', { name: 'productId' })
   productId!: number;
}
