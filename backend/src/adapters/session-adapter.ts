import { INestApplicationContext, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { RequestHandler } from 'express';
import passport from 'passport';
import { SocketAuth } from 'src/auth/types/socket-auth.type';

export class SessionAdapter extends IoAdapter {
   private readonly logger = new Logger(SessionAdapter.name);
   private session: RequestHandler;

   constructor(app: INestApplicationContext, session: RequestHandler) {
      super(app);
      this.session = session;
   }

   create(port: number, options?: any) {
      const server: any = super.create(port, options);

      const wrap = (middleware) => (socket, next) =>
         middleware(socket.request, {}, next);

      server.use(wrap(this.session));
      server.use(wrap(passport.initialize()));
      server.use(wrap(passport.session()));
      server.use(createCookieMiddleware(this.logger));

      return server;
   }
}

// REFERENCE: https://socket.io/how-to/use-with-express-session
const createCookieMiddleware =
   (logger: Logger) => (socket: SocketAuth, next) => {
      try {
         const user = socket.request.user;
         if (!user) {
            logger.debug('forbidden, skipping connection');
            return next(new Error('Forbidden'));
         }
         logger.debug('allow connection');

         const userId = socket.request.user!.id;
         socket.userId = userId;
         logger.debug(`store userId on socket instance ${userId}`);

         return next();
      } catch (error) {
         logger.debug(`unkown error ${JSON.stringify(error)}`);
         return next(new Error('Unknown error'));
      }
   };
