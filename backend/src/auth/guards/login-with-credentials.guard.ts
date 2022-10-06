import {
   ExecutionContext,
   HttpStatus,
   Injectable,
   UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LogInWithCredentialsGuard extends AuthGuard('local') {
   async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest();
      // ha van megfelelő email címmel és jelszóval elmentett user
      if (request.user) {
         // akkor hozzuk létre a sessionjét a session storeban
         await super.logIn(request);
         return true;
      }

      return false;
   }

   handleRequest(err: any, user: any) {
      if (err || !user) {
         if (err?.status === HttpStatus.NOT_FOUND) {
            throw new UnauthorizedException('email is not registered');
         }
         return null;
      }
      return user;
   }
}
