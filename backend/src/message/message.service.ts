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

   getPartners(id: number) {
      return this.messageRepo.manager
         .createQueryBuilder(User, 'u')
         .select(['id', 'name', 'picture'])
         .where((qb) => {
            const subQuery = qb
               .subQuery()
               .select(
                  'distinct case when m.receiverId = :id then m.senderId ' +
                     'when m.senderId = :id then m.receiverId end',
                  'partnerId',
               )
               .from(Message, 'm');
            return 'u.id in ' + subQuery.getQuery();
         })
         .setParameter('id', id)
         .getRawMany();
   }
}
