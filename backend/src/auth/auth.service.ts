import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
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

   signInWithGoogle(req: any) {
      console.log(req);
   }

   public async getAuthenticatedUser(email: string, plainTextPassword: string) {
      const user = await this.usersService.getByEmail(email);
      const isMatching = await bcrypt.compare(plainTextPassword, user.password);
      return isMatching ? user : null;
   }

   public logout(request: Request) {
      request.logOut();
      request.session.cookie.maxAge = 0;
   }
}
