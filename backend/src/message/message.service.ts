import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Brackets, Repository } from 'typeorm';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
   constructor(
      @InjectRepository(Message)
      private messageRepo: Repository<Message>,
   ) {}

   create(senderId: number, receiverId: number, text: string) {
      return this.messageRepo.save({
         senderId,
         receiverId,
         text,
         seen: false,
      });
   }

   findAll() {
      return this.messageRepo.find();
   }

   findOne(id: number) {
      return `This action returns a #${id} message`;
   }

   findMessagesFrom(from: number, id: number) {
      return this.messageRepo
         .createQueryBuilder('m')
         .select(['sent', 'seen', 'text'])
         .addSelect('m.senderId = :id', 'self')
         .where(
            new Brackets((qb) => {
               qb.where('m.senderId = :senderId', { senderId: from }).andWhere(
                  'm.receiverId = :id',
                  { id },
               );
            }),
         )
         .orWhere(
            new Brackets((qb) => {
               qb.where('m.receiverId = :senderId').andWhere(
                  'm.senderId = :id',
               );
            }),
         )
         .orderBy('m.sent')
         .getRawMany();
   }

   update(id: number, updateMessageDto: UpdateMessageDto) {
      return `This action updates a #${id} message`;
   }

   remove(id: number) {
      return `This action removes a #${id} message`;
   }

   async getPartners(id: number): Promise<
      {
         id: number;
         name: string;
         picture: string[];
         unseenMessages: number;
      }[]
   > {
      const messagePartners = await this.messageRepo
         .createQueryBuilder('m')
         .select([
            'sender.id as "senderId"',
            'sender.name as "senderName"',
            'sender.picture as "senderPicture"',
            'receiver.id as "receiverId"',
            'receiver.name as "receiverName"',
            'receiver.picture as "receiverPicture"',
         ])
         .addSelect([
            'm.receiverId as "receiverId"',
            'm.senderId as "senderId"',
            'sum(case when m.receiverId = :id and m.seen = false then 1 else 0 end)::int4 as "unseenMessages"',
         ])
         .leftJoin(User, 'sender', 'sender.id = m.senderId')
         .leftJoin(User, 'receiver', 'receiver.id = m.receiverId')
         .where('m.receiverId = :id')
         .orWhere('m.senderId = :id')
         .groupBy('sender.id')
         .addGroupBy('sender.name')
         .addGroupBy('sender.picture')
         .addGroupBy('receiver.id')
         .addGroupBy('receiver.name')
         .addGroupBy('receiver.picture')
         .addGroupBy('m.senderId')
         .addGroupBy('m.receiverId')
         .setParameter('id', id)
         .getRawMany();

      return messagePartners.map((partner) => {
         const {
            senderId,
            senderName,
            senderPicture,
            receiverId,
            receiverName,
            receiverPicture,
            ...result
         } = partner;
         if (senderId === id) {
            return {
               ...result,
               id: receiverId,
               name: receiverName,
               picture: receiverPicture,
            };
         }
         return {
            ...result,
            id: senderId,
            name: senderName,
            picture: senderPicture,
         };
      });
   }

   seenMessages(id: any, partnerId: number) {
      this.messageRepo.update(
         { receiverId: id, senderId: partnerId },
         { seen: true },
      );
   }
}
