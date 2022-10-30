import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsCookieAuthGuard implements CanActivate {
   async canActivate(context: ExecutionContext) {
      const client = context.switchToWs().getClient();
      const request = client.request;
      if (!request.isAuthenticated()) {
         throw new WsException('Invalid credentials');
      }
      return true;
   }
}
