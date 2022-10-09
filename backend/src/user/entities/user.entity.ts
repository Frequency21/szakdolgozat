import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
   @Column({ nullable: true, default: null })
   password?: string;

   /** Identity provider (in case of OIDC authentication) */
   @Exclude()
   @Column({ nullable: true, default: null })
   idp?: string;

   @Column({ nullable: true, default: null })
   picture?: string;

   @ApiPropertyOptional({ type: [Product], default: [] })
   @OneToMany(() => Product, (product) => product.owner)
   products!: Product[];
}

export type GoogleUser = Required<Pick<User, 'email' | 'name' | 'idp'>> &
   Pick<User, 'picture'>;
