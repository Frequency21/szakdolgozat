import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Message } from 'src/message/entities/message.entity';
import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
   admin = 'admin',
   customer = 'customer',
}

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

   @Column('enum', { enum: Role, default: Role.customer })
   role!: Role;

   @Exclude()
   @Column({ nullable: true, default: null })
   barionPosKey?: string;

   @Exclude()
   @Column({ nullable: true, default: null })
   barionEmail?: string;

   @ApiPropertyOptional({ type: [Product], default: [] })
   @OneToMany(() => Product, (product) => product.seller)
   products!: Product[];

   @ApiPropertyOptional({ type: [Product], default: [] })
   @OneToMany(() => Product, (product) => product.buyer)
   boughtProducts!: Product[];

   @OneToMany(() => Message, (message) => message.sender)
   sentMessages?: Message[];

   @OneToMany(() => Message, (message) => message.receiver)
   receivedMessages?: Message[];
}

export type GoogleUser = Required<Pick<User, 'email' | 'name' | 'idp'>> &
   Pick<User, 'picture'>;
