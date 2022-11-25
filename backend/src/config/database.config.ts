import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { env } from 'process';

export default registerAs(
   'typeorm',
   (): { heroku: TypeOrmModuleOptions; local: TypeOrmModuleOptions } => ({
      heroku: {
         url: env.DATABASE_URL,
         ssl: env.DATABASE_SSL
            ? env.DATABASE_SSL === 'true'
               ? true
               : false
            : true,
         type: 'postgres',
         entities: ['dist/**/*.entity.js'],
         synchronize: true,
         dropSchema: false,
         autoLoadEntities: true,
         extra: {
            ssl: {
               rejectUnauthorized: false,
            },
         },
         // logging: env.NODE_ENV === 'development',
      },
      local: {
         type: 'postgres',
         host: env.DATABASE_HOST,
         port: (env.DATABASE_PORT && +env.DATABASE_PORT) || 5433,
         username: env.DATABASE_USER,
         password: env.DATABASE_PASSWORD,
         database: env.DATABASE_NAME,
         entities: ['dist/**/*.entity.js'],
         dropSchema: false,
         synchronize: true,
         autoLoadEntities: true,
      },
   }),
);
