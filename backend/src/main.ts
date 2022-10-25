import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { env } from 'process';
import { AppModule } from './app.module';

async function bootstrap() {
   const app = await NestFactory.create(AppModule, {
      cors: false,
   });

   app.use(cookieParser());
   // app.use(helmet());
   app.useGlobalPipes(
      // TODO: forbidNonWhitelisted false in production
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
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

   Logger.log(
      `Server is listening on port ${process.env.PORT || 3000}`,
      'Application',
   );
   await app.listen(process.env.PORT || 3000);
}
bootstrap();
