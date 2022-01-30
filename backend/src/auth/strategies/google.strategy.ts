import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { config } from 'dotenv';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from 'src/user/user.service';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
   constructor(private userService: UserService) {
      super({
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: 'http://localhost:3000/api/auth/google/redirect',
         scope: ['email', 'profile'],
      });
   }

   async validate(
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: VerifyCallback,
   ): Promise<any> {
      const { name, emails, photos } = profile;
      const googleUser = {
         email: emails[0].value,
         firstName: name.givenName,
         lastName: name.familyName,
         picture: photos[0].value,
         accessToken,
      };
      console.log(googleUser);
      const user = await this.userService.getByEmail(googleUser.email);
      if (!googleUser) {
         throw new UnauthorizedException();
      }

      done(null, user);
   }
}
