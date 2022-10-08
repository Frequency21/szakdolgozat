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
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CookieAuthGuard } from './guards/cookie-auth.guard';
import { LogInWithCredentialsGuard } from './guards/login-with-credentials.guard';

@ApiTags('authentication')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @ApiCreatedResponse({
      type: User,
      description:
         'Registration was successful, returning the created new user',
   })
   @ApiConflictResponse({
      description: 'Email is already registered.',
   })
   @Post('register')
   async register(@Body() registrationData: CreateUserDto) {
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
      return request.user;
   }

   @ApiOkResponse()
   @UseGuards(CookieAuthGuard)
   @Get()
   async authenticate(@Req() request: Request) {
      return request.user;
   }

   @ApiOkResponse({
      description: 'User logged out, session was succesfully destroyed',
   })
   @UseGuards(CookieAuthGuard)
   @Delete('logout')
   async logOut(@Req() request: Request) {
      this.authService.logout(request);
   }

   @HttpCode(200)
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
