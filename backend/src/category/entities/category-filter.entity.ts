import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
   Column,
   Entity,
   JoinColumn,
   ManyToOne,
   PrimaryGeneratedColumn,
} from 'typeorm';
import { Category, CategoryProperties } from './category.entity';

export class ProductProperties {
   @ApiProperty()
   @IsBoolean()
   @IsOptional()
   isAuction?: boolean;

   @ApiPropertyOptional()
   @IsNumber()
   @IsOptional()
   price?: number;

   @ApiPropertyOptional()
   @IsNumber()
   @IsOptional()
   priceUntil?: number;

   @ApiPropertyOptional()
   @IsDateString()
   @IsOptional()
   startedFrom?: Date;

   @ApiPropertyOptional()
   @IsDateString()
   @IsOptional()
   expireUntil?: Date;
}

@Entity()
export class CategoryFilter {
   @ApiProperty()
   @PrimaryGeneratedColumn()
   id!: number;

   @ApiProperty()
   @Column({ type: 'boolean', nullable: true })
   isAuction!: boolean | null;

   @ApiPropertyOptional()
   @Column({ type: 'int4', nullable: true })
   price?: number | null;

   @ApiPropertyOptional()
   @Column({ type: 'int4', nullable: true })
   priceUntil?: number | null;

   @ApiPropertyOptional()
   @Column({ type: 'date', nullable: true })
   startedFrom?: Date | null;

   @ApiPropertyOptional()
   @Column({ type: 'date', nullable: true })
   expireUntil?: Date | null;

   @ApiPropertyOptional()
   @Column('jsonb', { default: {} })
   categoryProperties?: CategoryProperties;

   @ManyToOne(() => Category, (category) => category.categoryFilter)
   @JoinColumn({ name: 'categoryId' })
   category?: Category;

   @Column({ name: 'categoryId' })
   categoryId?: number;

   @ManyToOne(() => User, (user) => user.categoryFilters)
   @JoinColumn({ name: 'userId' })
   user?: User;

   @Column({ name: 'userId' })
   userId?: number;
}
