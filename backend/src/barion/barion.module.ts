import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BarionController } from './barion.controller';
import { BarionService } from './barion.service';
import { Payment } from './entities/payment.entity';

@Module({
   imports: [TypeOrmModule.forFeature([Payment]), AuthModule, ConfigModule],
   controllers: [BarionController],
   providers: [BarionService],
   exports: [TypeOrmModule],
})
export class BarionModule {}
