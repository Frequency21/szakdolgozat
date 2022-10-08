import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
   @ApiProperty({ example: 1 })
   @PrimaryGeneratedColumn()
   id!: number;

   @ApiProperty({ example: 'asd@gmail.com' })
   @Column({ unique: true })
   email!: string;

   @ApiProperty({ example: 'John Doe' })
   @Column()
   name!: string;

   @Exclude()
   @Column()
   password!: string;

   @ApiProperty({ type: [Product] })
   @OneToMany(() => Product, (product) => product.owner)
   products!: Product[];
}
