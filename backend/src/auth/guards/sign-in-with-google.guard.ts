import {
   ExecutionContext,
   Injectable,
   UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SignInWithGoogleGuard extends AuthGuard('custom') {
   async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest();
      // create session in sessions store
      await super.logIn(request);
      return true;
   }

   handleRequest(err: any, user: any) {
      if (err || !user) {
         throw new UnauthorizedException();
      }
      return user;
   }
}
