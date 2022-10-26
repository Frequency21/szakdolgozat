import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
   @ApiProperty({ example: 1 })
   @PrimaryGeneratedColumn()
   id!: number;

   @ApiProperty({ example: false })
   @Column()
   seen!: boolean;

   @ManyToOne(() => User, (user) => user.sentMessages)
   sender?: User;

   @ManyToOne(() => User, (user) => user.receivedMessages)
   receiver?: User;
}
