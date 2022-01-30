import {
   Body,
   ClassSerializerInterceptor,
   Controller,
   Delete,
   Get,
   HttpCode,
   Logger,
   Post,
   Req,
   UseGuards,
   UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CookieAuthGuard } from './guards/cookie-auth.guard';
import { LogInWithCredentialsGuard } from './guards/login-with-credentials.guard';
import { LoginWithGoogleGuard } from './guards/login-with-google.guard';
import { ReqWithUser } from './interfaces/req-with-user.interface';

@ApiTags('authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @ApiResponse({ status: 201, type: User })
   @Post('register')
   async register(@Body() registrationData: CreateUserDto) {
      return this.authService.register(registrationData);
   }

   @ApiBody({ type: LoginDto })
   @HttpCode(200)
   @UseGuards(LogInWithCredentialsGuard)
   @Post('login')
   async logIn(@Req() request: ReqWithUser) {
      return request.user;
   }

   @UseGuards(LoginWithGoogleGuard)
   @Get('login/google')
   async loginWithGoogle() {
      //
   }

   @UseGuards(LoginWithGoogleGuard)
   @Get('google/redirect')
   async signInWithGoogleRedirect(@Req() req) {
      return this.authService.signInWithGoogle(req);
   }

   @HttpCode(200)
   @UseGuards(CookieAuthGuard)
   @Get()
   async authenticate(@Req() request: ReqWithUser) {
      return request.user;
   }

   @HttpCode(200)
   @UseGuards(CookieAuthGuard)
   @Delete('logout')
   async logOut(@Req() request: ReqWithUser) {
      this.authService.logout(request);
   }

   @HttpCode(200)
   @UseGuards(CookieAuthGuard)
   @Delete('destroy-session')
   async destroySession(@Req() request: ReqWithUser) {
      request.session.destroy((err: any) => {
         Logger.error(`Error while destroying session:\n${err}`, 'Session');
      });
   }
}
