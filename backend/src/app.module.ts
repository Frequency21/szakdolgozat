import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
   ServeStaticModule,
   ServeStaticModuleOptions,
} from '@nestjs/serve-static';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import dbConfig from './config/database.config';
import staticServeConfig from './config/serve-static.config';
import { UserModule } from './user/user.module';

@Module({
   imports: [
      ConfigModule.forRoot({
         load: [dbConfig, staticServeConfig],
      }),
      ServeStaticModule.forRootAsync({
         imports: [ConfigModule],
         inject: [ConfigService],
         useFactory: async (configService: ConfigService) =>
            configService.get<ServeStaticModuleOptions[]>('serveStatic')!,
      }),
      TypeOrmModule.forRootAsync({
         imports: [ConfigModule],
         inject: [ConfigService],
         useFactory: async (configService: ConfigService) =>
            configService.get<TypeOrmModuleOptions>('typeorm.heroku')!,
      }),
      UserModule,
   ],
})
export class AppModule {}
