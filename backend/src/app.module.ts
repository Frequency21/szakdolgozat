import { Inject, Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import RedisStore from 'connect-redis';
import session from 'express-session';
import passport from 'passport';
import { env, exit } from 'process';
import { RedisClientType } from 'redis';
import { AuthModule } from './auth/auth.module';
import dbConfig from './config/database.config';
import { REDIS } from './config/redis/redis.conts';
import { RedisModule } from './config/redis/redis.module';
import { staticServeConfig } from './config/serve-static.config';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { MessageModule } from './message/message.module';
import { AwsModule } from './aws/aws.module';
@Module({
   imports: [
      ConfigModule.forRoot({
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
   ],
})
export class AppModule {
   constructor(@Inject(REDIS) private readonly redisClient: RedisClientType) {}

   async configure(consumer: MiddlewareConsumer) {
      try {
         await this.redisClient.connect();
      } catch (err) {
         Logger.error(
            "Couldn't connect to Redis. Application shutdown",
            'Redis Client',
         );
         exit(1);
      }
      consumer
         .apply(
            session({
               store: new (RedisStore(session))({
                  client: this.redisClient as any,
                  logErrors: true,
               }),
               secret: env.SESSION_SECRET || 'topsecret',
               resave: false,
               saveUninitialized: false,
               cookie: {
                  sameSite: true,
                  httpOnly: env.SSL
                     ? env.SSL === 'true'
                        ? true
                        : false
                     : true,
                  maxAge: 86400000,
               },
            }),
            passport.initialize(),
            passport.session(),
         )
         .forRoutes('*');
   }
}
