import { Logger, Module } from '@nestjs/common';
import RedisStore from 'connect-redis';
import session from 'express-session';
import Redis, { RedisOptions } from 'ioredis';
import { env } from 'process';
import { REDIS, SESSION_STORE } from './redis.const';

@Module({
   providers: [
      {
         provide: REDIS,
         useFactory: () => {
            const redisClient = new Redis(env.REDIS_TLS_URL!, {
               tls: {
                  rejectUnauthorized: false,
               },
               reconnectOnError: (err) => {
                  Logger.error(`Error during redis connection ${err}`);
                  return 1;
               },
               retryStrategy(retries) {
                  const nextRetry = retries > 4 ? 30 : retries * 5;
                  Logger.error(
                     `(${retries}) ...retry after ${nextRetry} seconds.`,
                     'Redis Connection',
                  );
                  if (retries > 10)
                     return new Error("Couldn't connect to Redis Client.");
                  return nextRetry * 1000;
               },
            } as RedisOptions);

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
         useFactory: (redisClient: Redis) => {
            return new (RedisStore(session))({
               client: redisClient,
               logErrors: true,
            });
         },
         inject: [REDIS],
      },
   ],
   exports: [REDIS, SESSION_STORE],
})
export class RedisModule {}
