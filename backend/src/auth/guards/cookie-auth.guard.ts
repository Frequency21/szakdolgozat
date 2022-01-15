import {
   CanActivate,
   ExecutionContext,
   Injectable,
   UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class CookieAuthGuard implements CanActivate {
   constructor(private authService: AuthService) {}

   async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      if (!request.isAuthenticated()) {
         this.authService.logout(request);
         response.clearCookie('connect.sid');
         throw new UnauthorizedException();
      }
      return true;
   }
}
