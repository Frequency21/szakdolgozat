import {
   CanActivate,
   ExecutionContext,
   ForbiddenException,
   Injectable,
   UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { META_DATA_ADMIN } from 'src/shared/decorators/admin.decorator';
import { Role } from 'src/user/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class CookieAuthGuard implements CanActivate {
   constructor(
      private reflector: Reflector,
      private authService: AuthService,
   ) {}

   async canActivate(context: ExecutionContext) {
      const request: Request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      if (!request.isAuthenticated()) {
         this.authService.logout(request);
         response.clearCookie('connect.sid');
         throw new UnauthorizedException();
      }

      const role = request.user.role;
      const isAdminAPI = this.reflector.getAllAndOverride<true | undefined>(
         META_DATA_ADMIN,
         [context.getHandler(), context.getClass()],
      );

      if (role === Role.admin) {
         return true;
      }

      if (isAdminAPI) {
         throw new ForbiddenException();
      }

      return true;
   }
}
