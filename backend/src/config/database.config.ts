import { MongooseModuleOptions } from '@nestjs/mongoose';

export const databaseUri = (env: Record<string, string | undefined>): string =>
   `mongodb://${env.DATABASE_HOST}:${env.DATABASE_PORT}`;

export const databaseOptions = (
   env: Record<string, string | undefined>,
): MongooseModuleOptions => ({
   ssl: false,
   dbName: env.DATABASE_NAME,
   autoCreate: true,
   autoIndex: true,
});
