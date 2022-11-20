import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from 'src/config/redis/redis.module';
import { MessageModule } from 'src/message/message.module';
import { NotificationModule } from 'src/notification/notification.module';
import { WsMainGateway } from './ws-main.gateway';

@Module({
   imports: [AuthModule, RedisModule, MessageModule, NotificationModule],
   providers: [WsMainGateway],
})
export class WSMessagesModule {}
