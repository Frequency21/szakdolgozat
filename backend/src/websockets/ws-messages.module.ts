import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from 'src/config/redis/redis.module';
import { MessageModule } from 'src/message/message.module';
import { WsMessagesGateway } from './ws-messages.gateway';

@Module({
   imports: [AuthModule, RedisModule, MessageModule],
   providers: [WsMessagesGateway],
})
export class WSMessagesModule {}
