import { registerAs } from '@nestjs/config';
import { env } from 'process';

export default registerAs('typeorm', () => ({
   url: env.DATABASE_URL,
   ssl: env.DATABASE_SSL == 'true' || true,
   type: 'postgres',
   entities: ['dist/**/*.entity.js'],
   synchronize: true,
   autoLoadEntities: true,
   extra: {
      ssl: {
         rejectUnauthorized: false,
      },
   },
}));
