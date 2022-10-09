import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { OAuth2Client } from 'google-auth-library';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomStrategy } from './strategies/custom-strategy';
import { LocalSerializer } from './strategies/local-serializer';
import { LocalStrategy } from './strategies/local-strategy';

@Module({
   imports: [UserModule, PassportModule, ConfigModule],
   providers: [
      AuthService,
      LocalStrategy,
      CustomStrategy,
      LocalSerializer,
      {
         provide: OAuth2Client,
         useFactory: (config: ConfigService) => {
            const gClientId = config.get('GOOGLE_CLIENT_ID');
            // secret isn't necessary according to google docs
            const gClientSecret = config.get('GOOGLE_CLIENT_SECRET');
            return new OAuth2Client(gClientId, gClientSecret);
         },
         inject: [ConfigService],
      },
   ],
   controllers: [AuthController],
})
export class AuthModule {}
