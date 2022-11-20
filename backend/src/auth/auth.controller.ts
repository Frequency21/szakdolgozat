import {
   Body,
   ClassSerializerInterceptor,
   Controller,
   Delete,
   Get,
   Logger,
   Post,
   Req,
   UseGuards,
   UseInterceptors,
} from '@nestjs/common';
import {
   ApiBody,
   ApiConflictResponse,
   ApiCreatedResponse,
   ApiOkResponse,
   ApiOperation,
   ApiTags,
   ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { GoogleSignInDto } from 'src/user/dto/sign-in-with-google.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { RegisterWithPasswordDto } from '../user/dto/register-with-password.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CookieAuthGuard } from './guards/cookie-auth.guard';
import { LogInWithCredentialsGuard } from './guards/login-with-credentials.guard';
import { SignInWithGoogleGuard } from './guards/sign-in-with-google.guard';

@ApiTags('authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
   constructor(
      private readonly authService: AuthService,
      private userService: UserService,
   ) {}

   @ApiOperation({ summary: 'Email and password registration' })
   @ApiCreatedResponse({
      type: User,
      description:
         'Registration was successful, returning the created new user',
   })
   @ApiConflictResponse({
      description: 'Email is already registered.',
   })
   @Post('register')
   async register(@Body() registrationData: RegisterWithPasswordDto) {
      return this.authService.register(registrationData);
   }

   @ApiOperation({
      description: 'Logs in and returns the authentication cookie',
   })
   @ApiBody({ type: LoginDto })
   @ApiCreatedResponse({
      description: 'Login was successful',
      headers: {
         'SET-COOKIE': {
            schema: {
               type: 'string',
               example:
                  'connect.sid=keyboard cat; Path=/; Expires=Future date; SameSite=Strict',
            },
            description: 'Authentication cookie',
         },
      },
   })
   @ApiUnauthorizedResponse({
      description: 'email is not registered or password is invalid',
   })
   @UseGuards(LogInWithCredentialsGuard)
   @Post('login')
   async logIn(@Req() request: Request) {
      return this.userService.getLoginData(request.user!);
   }

   @ApiOperation({
      summary: 'Google OIDC',
      description:
         'Logs in user if google account email is in the database, creates new account if not.',
   })
   @ApiBody({ type: GoogleSignInDto, required: true })
   @ApiCreatedResponse({
      type: User,
      description:
         'Registration was successful, returning the created new user',
   })
   @UseGuards(SignInWithGoogleGuard)
   @Post('google-sign-in')
   async signInWithGoogle(@Req() req: Request) {
      const result = await this.userService.getLoginData(req.user!);
      return result;
   }

   @ApiOperation({
      summary: 'Destroys user sessions',
      description: 'Must call for Google OIDC and simple email/password login',
   })
   @ApiOkResponse({
      description: 'User logged out, session was succesfully destroyed',
   })
   @UseGuards(CookieAuthGuard)
   @Delete('logout')
   async logOut(@Req() request: Request) {
      this.authService.logout(request);
   }

   @ApiOperation({
      description: 'Returns user if theres a valid session',
   })
   @ApiOkResponse()
   @UseGuards(CookieAuthGuard)
   @Get()
   async authenticate(@Req() request: Request) {
      return this.userService.getLoginData(request.user!);
   }

   @ApiOperation({
      summary: 'DEVELOPMENT',
      description: 'Destroy session, but do not clear users cookie',
   })
   @ApiOkResponse()
   @UseGuards(CookieAuthGuard)
   @Delete('destroy-session')
   async destroySession(@Req() request: Request) {
      request.session.destroy((err: any) => {
         if (err !== null) {
            Logger.error(`Error while destroying session:\n${err}`, 'Session');
         }
      });
   }
}
