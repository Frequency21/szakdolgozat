import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product } from 'src/product/entities/product.entity';
import {
   Column,
   Entity,
   Index,
   OneToMany,
   PrimaryGeneratedColumn,
   Tree,
   TreeChildren,
   TreeParent,
} from 'typeorm';

export type CategoryProperties = Record<
   string,
   {
      multi: boolean;
      values: any[];
   }
>;

// REFERENCE: https://www.postgresql.org/docs/13/datatype-json.html#DATATYPE-JSONPATH
// 13.8-as a postgres verzió
@Entity()
@Tree('closure-table')
@Index('CATEGORY_PROPERTIES_INDEX', { synchronize: false })
export class Category {
   @ApiProperty({ example: 1 })
   @PrimaryGeneratedColumn()
   id!: number;

   @ApiProperty({ example: 'Cloths and accessories' })
   @Column({ unique: true })
   name!: string;

   @ApiProperty()
   @Column('jsonb', { default: {} })
   properties?: CategoryProperties;

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
