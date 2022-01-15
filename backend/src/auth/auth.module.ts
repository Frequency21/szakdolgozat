import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalSerializer } from './strategies/local-serializer';
import { LocalStrategy } from './strategies/local-strategy';

@Module({
   imports: [UserModule, PassportModule],
   providers: [AuthService, LocalStrategy, LocalSerializer],
   controllers: [AuthController],
})
export class AuthModule {}
