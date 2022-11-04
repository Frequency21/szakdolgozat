import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Message } from './entities/message.entity';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
   imports: [TypeOrmModule.forFeature([Message]), AuthModule],
   controllers: [MessageController],
   providers: [MessageService],
   exports: [TypeOrmModule, MessageService],
})
export class MessageModule {}
