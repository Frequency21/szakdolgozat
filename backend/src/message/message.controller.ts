import {
   Body,
   ClassSerializerInterceptor,
   Controller,
   Delete,
   Get,
   Param,
   Patch,
   Post,
   UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageService } from './message.service';

@ApiTags('message')
@Controller('message')
@UseInterceptors(ClassSerializerInterceptor)
export class MessageController {
   constructor(private readonly messageService: MessageService) {}

   @Post()
   create(@Body() createMessageDto: CreateMessageDto) {
      return this.messageService.create(createMessageDto);
   }

   @Get()
   findAll() {
      return this.messageService.findAll();
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.messageService.findOne(+id);
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
