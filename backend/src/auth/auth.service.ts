import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
   constructor(private readonly usersService: UserService) {}

   public async register(registrationData: CreateUserDto) {
      const hashedPassword = await bcrypt.hash(registrationData.password, 10);
      return this.usersService.create({
         ...registrationData,
         password: hashedPassword,
      });
   }

   /**
    * @throws NotFoundException if email doesn't exist
    * @param email
    * @param plainTextPassword
    * @returns user if password is matching, `null` if there's a user,
    * but password isn't matching or throws `NotFoundException` if theres no user with {@link email}
    */
   public async getAuthenticatedUser(
      email: string,
      plainTextPassword: string,
   ): Promise<User | null> | never {
      const user = await this.usersService.getByEmail(email);
      const isMatching = await bcrypt.compare(plainTextPassword, user.password);
      return isMatching ? user : null;
   }

   public logout(request: Request) {
      request.logOut();
      request.session.cookie.maxAge = 0;
   }
}
