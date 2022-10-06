import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalSerializer extends PassportSerializer {
   constructor(private readonly userService: UserService) {
      super();
   }

   serializeUser(user: User, done: CallableFunction) {
      if (user) {
         done(null, user.id);
      } else {
         done(new Error());
      }
   }

   async deserializeUser(userId: number, done: CallableFunction) {
      try {
         const user = await this.userService.getById(userId);
         done(null, user || false);
      } catch (err: any) {
         done(err, false);
      }
   }
}
