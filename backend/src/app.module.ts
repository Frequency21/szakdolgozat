import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AwsModule } from './aws/aws.module';
import { BarionModule } from './barion/barion.module';
import { CategoryModule } from './category/category.module';
import dbConfig from './config/database.config';
import { RedisModule } from './config/redis/redis.module';
import { staticServeConfig } from './config/serve-static.config';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';
import { ProductModule } from './product/product.module';
import { RatingModule } from './rating/rating.module';
import { UserModule } from './user/user.module';
import { WSMessagesModule } from './websockets/ws-main.module';
@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true,
         cache: true,
         load: [dbConfig],
      }),
      ServeStaticModule.forRoot(staticServeConfig),
      TypeOrmModule.forRootAsync({
         imports: [ConfigModule],
         inject: [ConfigService],
         useFactory: async (configService: ConfigService) =>
            configService.get<TypeOrmModuleOptions>('typeorm.heroku')!,
      }),
      RedisModule,
      AuthModule,
      UserModule,
      ProductModule,
      CategoryModule,
      MessageModule,
      AwsModule,
      WSMessagesModule,
      EventEmitterModule.forRoot(),
      NotificationModule,
      BarionModule,
      RatingModule,
   ],
})
export class AppModule {}
