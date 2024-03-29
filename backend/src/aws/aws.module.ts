import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { S3_CLIENT } from 'src/aws/aws.const';
import { AwsController } from './aws.controller';
import { AwsService } from './aws.service';

@Module({
   imports: [ConfigModule, AuthModule],
   controllers: [AwsController],
   providers: [
      AwsService,
      {
         provide: S3_CLIENT,
         useFactory: () => {
            return new S3Client({
               region: 'eu-central-1',
            });
         },
      },
   ],
   exports: [AwsService],
})
export class AwsModule {}
