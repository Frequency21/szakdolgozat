import {
   Injectable,
   NotFoundException,
   UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { RegisterWithPasswordDto } from 'src/user/dto/register-with-password.dto';
import { GoogleSignInDto } from 'src/user/dto/sign-in-with-google.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
   constructor(
      private readonly usersService: UserService,
      private oauthClient: OAuth2Client,
      private configService: ConfigService,
   ) {}

   public async register(registrationData: RegisterWithPasswordDto) {
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
   public async getAuthenticatedUserByEmailAndPassord(
      email: string,
      plainTextPassword: string,
   ): Promise<User | null> | never {
      const user = await this.usersService.getByEmail(email);
      const isMatching = user.password
         ? await bcrypt.compare(plainTextPassword, user.password)
         : false;
      return isMatching ? user : null;
   }

   public async getOrCreateUserByJwt(signInDto: GoogleSignInDto) {
      const ticket = await this.oauthClient.verifyIdToken({
         idToken: signInDto.jwt,
         audience: this.configService.get('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
         throw new UnauthorizedException();
      }
      let user: User | null;
      try {
         user = await this.usersService.getByEmail(payload.email);
      } catch (err: any) {
         if (err instanceof NotFoundException) {
            // "register" user with idp equals to google
            user = await this.usersService.registerGoogleUser({
               email: payload.email,
               idp: payload.iss,
               name: payload.name ?? 'Anonymus',
               picture: payload.picture,
            });
         } else {
            throw err;
         }
      }

      return user;
   }

   public logout(request: Request) {
      request.logOut();
      request.session.cookie.maxAge = 0;
   }
}
