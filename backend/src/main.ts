import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { env } from 'process';
import { SessionAdapter } from './adapters/session-adapter';
import { AppModule } from './app.module';
import { SESSION_STORE } from './config/redis/redis.const';

async function bootstrap() {
   const app = await NestFactory.create(AppModule, {
      cors: false,
   });

   app.use(cookieParser());
   // app.use(helmet());
   app.useGlobalPipes(
      // TODO: forbidNonWhitelisted false in production
      new ValidationPipe({
         transform: true,
         whitelist: true,
         forbidNonWhitelisted: true,
      }),
   );
   app.setGlobalPrefix('api');

   // setup swagger
   const documentConfig = new DocumentBuilder()
      .setContact(
         'DeepMarket',
         'https://deep-market.herokuapp.com/',
         'k.oliver.xcvii@gmail.com',
      )
      .setTitle(env.APP_TITLE || 'DeepMarket')
      .setDescription(`The ${env.APP_TITLE || 'DeepMarket'} API description`)
      .setVersion(env.npm_package_version || '1.0.0')
      .build();
   const document = SwaggerModule.createDocument(app, documentConfig);
   SwaggerModule.setup('api-doc', app, document, {
      swaggerOptions: {
         // may write plugins in future
         plugins: [],
      },
   });

   // REFERENCE: http://expressjs.com/en/resources/middleware/session.html
   const store = app.get(SESSION_STORE);
   const sessionMiddleware = session({
      store,
      secret: env.SESSION_SECRET || 'topsecret',
      resave: false,
      saveUninitialized: false,
      cookie: {
         sameSite: true,
         httpOnly: env.SSL ? (env.SSL === 'true' ? true : false) : true,
         maxAge: 86400000,
      },
   });

   app.use(sessionMiddleware, passport.initialize(), passport.session());
   app.useWebSocketAdapter(new SessionAdapter(app, sessionMiddleware));

   Logger.log(
      `Server is listening on port ${process.env.PORT || 3000}`,
      'Application',
   );
   await app.listen(process.env.PORT || 3000);
}
bootstrap();
