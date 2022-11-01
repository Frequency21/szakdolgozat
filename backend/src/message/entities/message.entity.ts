import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import {
   Column,
   Entity,
   JoinColumn,
   ManyToOne,
   PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
   @ApiProperty({ example: 1 })
   @PrimaryGeneratedColumn()
   id!: number;

   @ApiProperty({ example: false })
   @Column()
   seen!: boolean;

   @ManyToOne(() => User, (user) => user.sentMessages)
   @JoinColumn({ name: 'sender_id', referencedColumnName: 'id' })
   sender?: User;

   @Column('integer', { name: 'sender_id' })
   senderId!: number;

   @ManyToOne(() => User, (user) => user.receivedMessages)
   @JoinColumn({ name: 'receiver_id', referencedColumnName: 'id' })
   receiver?: User;

   @Column('integer', { name: 'receiver_id' })
   receiverId!: number;
}
