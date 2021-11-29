import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/users.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
   constructor(private userService: UserService) {}

   @Post()
   async create(@Body() createUserDto: CreateUserDto): Promise<User> {
      return await this.userService.createUser(createUserDto);
   }

   @Get()
   async findAll(): Promise<User[]> {
      return await this.userService.findAll();
   }
}
