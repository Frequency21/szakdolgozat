import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import dbConfig from './config/database.config';
import { UserModule } from './user/user.module';

@Module({
   imports: [
      ConfigModule.forRoot({
         load: [dbConfig],
         isGlobal: true,
      }),
      TypeOrmModule.forRootAsync({
         imports: [ConfigModule],
         useFactory: async (configService: ConfigService) =>
            configService.get('typeorm'),
         inject: [ConfigService],
      }),
      UserModule,
   ],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}
