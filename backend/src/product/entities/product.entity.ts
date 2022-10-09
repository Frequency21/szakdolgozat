import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
   @ApiProperty({ example: 1 })
   @PrimaryGeneratedColumn()
   id!: number;

   @ApiProperty({ example: 'karóra' })
   @Column()
   name!: string;

   @ApiProperty({ example: 10_000 })
   @Column()
   price!: number;

   @Column({ default: false })
   isBidding!: boolean;

   @ApiPropertyOptional()
   @Column({ nullable: true, default: null })
   minBid?: number;

   @ApiProperty({ type: () => User })
   @ManyToOne(() => User, (user) => user.products)
   owner!: User;
}
