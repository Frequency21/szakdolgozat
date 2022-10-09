import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
   constructor(private authService: AuthService) {
      super({ usernameField: 'email' });
   }

   /**
    * @throws NotFoundException if email doesn't exist
    * @param email
    * @param password
    * @returns user or null if password doesn't match
    */
   async validate(email: string, password: string): Promise<User | null> {
      const user = await this.authService.getAuthenticatedUser(email, password);
      return user;
   }
}
