import {
   Body,
   ClassSerializerInterceptor,
   Controller,
   Get,
   Post,
   UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
   constructor(private userService: UserService) {}

   @Post('greeting')
   greetingMessage(@Body() body: { msg: string }) {
      console.log(body.msg);
      return {
         message: 'Bonjour',
      };
   }

   @ApiCreatedResponse({
      type: User,
      description: 'Updated user',
   })
   @Post()
   async updateUser(@Body() updateUserDto: UpdateUserDto) {
      const res = await this.userService.updateUser(updateUserDto);
      return plainToClass(User, res);
   }

   @ApiOkResponse({
      type: [User],
      description: 'All users',
   })
   @Get()
   getAllUser() {
      return this.userService.getAllUser();
   }
}
