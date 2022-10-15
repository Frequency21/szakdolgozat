import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product } from 'src/product/entities/product.entity';
import {
   Column,
   Entity,
   OneToOne,
   PrimaryGeneratedColumn,
   Tree,
   TreeChildren,
   TreeParent,
} from 'typeorm';

@Entity()
@Tree('closure-table')
export class Category {
   @ApiProperty({ example: 1 })
   @PrimaryGeneratedColumn()
   id!: number;

   @ApiProperty({ example: 'Cloths and accessories' })
   @Column()
   name!: string;

   @ApiPropertyOptional({ type: () => [Category] })
   @TreeChildren()
   subCategories?: Category[];

   @ApiPropertyOptional({ type: () => Category })
   @TreeParent()
   parentCategory?: Category;

   @ApiPropertyOptional({ type: () => Product })
   @OneToOne(() => Product, (product) => product.category)
   product?: Product;
}
