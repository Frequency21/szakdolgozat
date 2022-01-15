import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/constants/db/postgresql.error.codes';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
   constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
   ) {}

   async getByEmail(email: string) {
      const user = await this.usersRepository.findOne({ email });
      if (user) {
         return user;
      }
      throw new HttpException(
         'User with this email does not exist',
         HttpStatus.NOT_FOUND,
      );
   }

   async getById(id: number) {
      let user: User | undefined;
      try {
         user = await this.usersRepository.findOne({ id });
      } catch (err: any) {
         if (err?.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
            throw new HttpException(
               'User with that id does not exist',
               HttpStatus.NOT_FOUND,
            );
         }
      }
      return user;
   }

   async create(userData: CreateUserDto) {
      const newUser = await this.usersRepository.create(userData);
      try {
         await this.usersRepository.save(newUser);
         return newUser;
      } catch (err: any) {
         if (err?.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
            throw new HttpException(
               'User with that email already exists',
               HttpStatus.BAD_REQUEST,
            );
         }
         return null;
      }
   }
}
