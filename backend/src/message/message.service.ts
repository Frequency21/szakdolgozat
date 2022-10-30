import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
   constructor(
      @InjectRepository(Message)
      private messageRepo: Repository<Message>,
   ) {}

   create(senderId: number, createMessageDto: CreateMessageDto) {
      // return this.messageRepo.save;
   }

   findAll() {
      return `This action returns all message`;
   }

   findOne(id: number) {
      return `This action returns a #${id} message`;
   }

   update(id: number, updateMessageDto: UpdateMessageDto) {
      return `This action updates a #${id} message`;
   }

   remove(id: number) {
      return `This action removes a #${id} message`;
   }
}
