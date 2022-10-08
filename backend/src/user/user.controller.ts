import {
   Body,
   ClassSerializerInterceptor,
   Controller,
   Post,
   UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
   constructor(private userService: UserService) {}

   @Post('greeting')
   async greetingMessage(@Body() body: { msg: string }) {
      console.log(body.msg);
      return {
         message: 'Bonjour',
      };
   }
}
