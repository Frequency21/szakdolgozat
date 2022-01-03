import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from 'process';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

@Module({
   imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRoot({
         type: 'postgres',
         host: env.DATABASE_HOST,
         port: +env.DATABASE_PORT,
         username: env.DATABASE_USER,
         password: env.DATABASE_PASSWORD,
         database: env.DATABASE_NAME,
         entities: ['dist/**/*.entity.js'],
         synchronize: true,
         autoLoadEntities: true,
      }),
      UserModule,
   ],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}
