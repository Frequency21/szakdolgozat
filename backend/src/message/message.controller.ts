import {
   Body,
   ClassSerializerInterceptor,
   Controller,
   Delete,
   Get,
   Param,
   ParseIntPipe,
   Patch,
   Post,
   UseGuards,
   UseInterceptors,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiTags } from '@nestjs/swagger';
import { CookieAuthGuard } from 'src/auth/guards/cookie-auth.guard';
import {
   SentMessagePayload,
   SENT_MESSAGE_EVENT,
} from 'src/events/sent-message.event';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageService } from './message.service';

@ApiTags('message')
@Controller('message')
@UseInterceptors(ClassSerializerInterceptor)
export class MessageController {
   constructor(
      private readonly messageService: MessageService,
      private eventEmitter: EventEmitter2,
   ) {}

   @Post(':id')
   async create(
      @Param('id', ParseIntPipe) to: number,
      @Body() createMessageDto: CreateMessageDto,
      @CurrentUser() user: User,
   ) {
      const message = await this.messageService.create(
         user.id,
         to,
         createMessageDto.text,
      );
      const eventPayload: SentMessagePayload = {
         from: user.id,
         to,
         text: createMessageDto.text,
      };
      this.eventEmitter.emit(SENT_MESSAGE_EVENT, eventPayload);
      return message;
   }

   @Get()
   async findAll() {
      return this.messageService.findAll();
   }

   @UseGuards(CookieAuthGuard)
   @Get(':id')
   findMessagesFrom(
      @Param('id', ParseIntPipe) from: number,
      @CurrentUser() user: User,
   ) {
      return this.messageService.findMessagesFrom(from, user.id);
   }

   @Patch(':id')
   update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
      return this.messageService.update(+id, updateMessageDto);
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
      return this.messageService.remove(+id);
   }
}
