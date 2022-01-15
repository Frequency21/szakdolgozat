import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
   @ApiProperty()
   @PrimaryGeneratedColumn()
   public id?: number;

   @ApiProperty()
   @Column({ unique: true })
   public email!: string;

   @ApiProperty()
   @Column()
   public name!: string;

   @Column()
   @Exclude()
   public password!: string;
}
