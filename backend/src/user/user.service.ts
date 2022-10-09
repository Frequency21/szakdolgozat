import {
   ConflictException,
   HttpException,
   HttpStatus,
   Injectable,
   NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PG_UNIQUE_CONSTRAINT_VIOLATION } from 'src/constants/db/postgresql.error.codes';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
   constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
   ) {}

   /**
    * @throws {@link NotFoundException} if email doesn't exist
    * @param email
    * @returns user with email or throws error
    */
   async getByEmail(email: string): Promise<User> | never {
      const user = await this.usersRepository.findOne({ email });
      if (user) return user;
      throw new NotFoundException({
         message: 'User with this email does not exist',
      });
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
      const newUser = this.usersRepository.create(userData);
      try {
         await this.usersRepository.save(newUser);
         return newUser;
      } catch (err: any) {
         if (err?.code === PG_UNIQUE_CONSTRAINT_VIOLATION) {
            throw new ConflictException({
               message: 'User with that email already exists',
            });
         }
         return null;
      }
   }
}
