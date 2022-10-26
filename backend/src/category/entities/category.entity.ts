import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product } from 'src/product/entities/product.entity';
import {
   Column,
   Entity,
   OneToMany,
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
   @Column({ unique: true })
   name!: string;

   @ApiPropertyOptional({ type: () => [Category] })
   @TreeChildren({ cascade: true })
   subCategories?: Category[];

   @ApiPropertyOptional({ type: () => Category })
   @TreeParent({ onDelete: 'CASCADE' })
   parentCategory?: Category;

   @ApiPropertyOptional({ type: () => Product })
   @OneToMany(() => Product, (product) => product.category)
   products?: Product[];
}
