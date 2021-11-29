import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from 'process';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseOptions, databaseUri } from './config/database.config';
import { UserModule } from './users/user.module';

@Module({
   imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      MongooseModule.forRoot(databaseUri(env), databaseOptions(env)),
      UserModule,
   ],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}
