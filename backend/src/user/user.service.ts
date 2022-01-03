import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
   constructor(
      @InjectRepository(User) private usersRepository: Repository<User>,
   ) {}

   async findAll(): Promise<User[]> {
      return this.usersRepository.find();
   }

   async findOne(id: string): Promise<User> {
      return this.usersRepository.findOne(id);
   }

   async insertOne(userDto: UserDto) {
      const entity = this.usersRepository.create(userDto);
      console.log(entity);
      return await this.usersRepository.save(entity);
   }

   async remove(id: string): Promise<void> {
      await this.usersRepository.delete(id);
   }
}
