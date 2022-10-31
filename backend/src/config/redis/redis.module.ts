import { Logger, Module } from '@nestjs/common';
import RedisStore from 'connect-redis';
import session from 'express-session';
import { env } from 'process';
import { createClient } from 'redis';
import { REDIS, SESSION_STORE } from './redis.const';

@Module({
   providers: [
      {
         provide: REDIS,
         useFactory: () => {
            const redisClient = createClient({
               url: env.REDIS_TLS_URL,
               socket: {
                  tls: true,
                  rejectUnauthorized: false,
                  reconnectStrategy: (retries: number) => {
                     retries = retries + 1;
                     const nextRetry = retries > 4 ? 30 : retries * 5;
                     Logger.error(
                        `(${retries}) ...retry after ${nextRetry} seconds.`,
                        'Redis Connection',
                     );
                     if (retries > 10)
                        return new Error("Couldn't connect to Redis Client.");
                     return nextRetry * 1000;
                  },
               },
               legacyMode: true,
            });

            redisClient.on('error', function (err) {
               Logger.error(
                  'Could not establish a connection with redis.\n' + err,
                  'Redis Connection',
               );
            });

            redisClient.on('connect', function () {
               Logger.log(
                  'Connected to redis successfully',
                  'Redis Connection',
               );
            });

            return redisClient;
         },
      },
      {
         provide: SESSION_STORE,
         useFactory: (redisClient: any) => {
            return new (RedisStore(session))({
               client: redisClient as any,
               logErrors: true,
            });
         },
         inject: [REDIS],
      },
   ],
   exports: [REDIS, SESSION_STORE],
})
export class RedisModule {}
