import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';

@Module({
   imports: [TypeOrmModule.forFeature([Notification]), AuthModule],
   providers: [NotificationService],
   exports: [NotificationService],
})
export class NotificationModule {}
