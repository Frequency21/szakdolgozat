import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { CategoryFilter } from 'src/category/entities/category-filter.entity';
import { Message } from 'src/message/entities/message.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Product } from 'src/product/entities/product.entity';
import {
   Column,
   Entity,
   JoinTable,
   ManyToMany,
   OneToMany,
   PrimaryGeneratedColumn,
} from 'typeorm';

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
   @Column({ type: 'text', nullable: true, select: false })
   password!: string | null;

   /** Identity provider (in case of OIDC authentication) */
   @Column({ type: 'text', nullable: true, select: false })
   idp!: string | null;

   @ApiProperty({
      example: 'https://cute-hedgehog-photos.com/sanyi.jpg',
      nullable: true,
   })
   @Column({ type: 'text', nullable: true })
   picture!: string | null;

   @ApiProperty({ enum: Role, default: Role.customer })
   @Column('enum', { enum: Role, default: Role.customer })
   role!: Role;

   @ApiPropertyOptional({ example: 'random UUID' })
   @Column({ type: 'text', nullable: true, select: false })
   barionPosKey!: string | null;

   @ApiPropertyOptional({ example: 'random email' })
   @Column({ type: 'text', nullable: true, select: false })
   barionEmail!: string | null;

   @ApiPropertyOptional({ type: [Product], default: [] })
   @OneToMany(() => Product, (product) => product.seller)
   products!: Product[];

   @ApiPropertyOptional({ type: [Product], default: [] })
   @OneToMany(() => Product, (product) => product.buyer)
   boughtProducts!: Product[];

   @ApiPropertyOptional({ type: [Product], default: [] })
   @ManyToMany(() => Product, (product) => product.basketOwners)
   @JoinTable({
      name: 'user_baskets',
      joinColumn: { name: 'userId' },
      inverseJoinColumn: { name: 'productId' },
   })
   baskets!: Product[];

   @ApiPropertyOptional({ type: [Message], default: [] })
   @OneToMany(() => Message, (message) => message.sender)
   sentMessages?: Message[];

   @ApiPropertyOptional({ type: [Message], default: [] })
   @OneToMany(() => Message, (message) => message.receiver)
   receivedMessages?: Message[];

   @ApiPropertyOptional({ type: [CategoryFilter], default: [] })
   @OneToMany(() => CategoryFilter, (cf) => cf.user)
   categoryFilters?: CategoryFilter[];

   @ApiPropertyOptional({ type: [Notification], default: [] })
   @OneToMany(() => Notification, (notification) => notification.user)
   notifications?: Notification[];
}

export type GoogleUser = Required<Pick<User, 'email' | 'name' | 'idp'>> &
   Pick<User, 'picture'>;
