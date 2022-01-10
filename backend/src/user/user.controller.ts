import {
   Body,
   ClassSerializerInterceptor,
   Controller,
   Get,
   Post,
   UseInterceptors,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
   constructor(private userService: UserService) {}

   @Get()
   async getAll() {
      return this.userService.findAll();
   }

   @Post()
   async insertUser(@Body() userDto: UserDto) {
      console.log(userDto);
      return this.userService.insertOne(userDto);
   }

   @Post('greeting')
   async greetingMessage(@Body() body: { msg: string }) {
      console.log(body.msg);
      return {
         message: 'Bonjour',
      };
   }
}
