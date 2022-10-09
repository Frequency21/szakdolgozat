import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy) {
   constructor(private authService: AuthService) {
      super();
   }

   async validate(req: Request): Promise<User | null> {
      const jwt: string | undefined = (req.body as any).jwt;
      if (!jwt) {
         throw new UnauthorizedException();
      }
      const user = await this.authService.getOrCreateUserByJwt({ jwt });
      if (!user) throw new Error();
      return user;
   }
}
