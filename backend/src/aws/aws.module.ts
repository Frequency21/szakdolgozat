import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import AWS from 'aws-sdk';
import { AWS_S3 } from 'src/aws/aws.const';
import { AwsController } from './aws.controller';

@Module({
   imports: [ConfigModule],
   controllers: [AwsController],
   providers: [
      {
         provide: AWS_S3,
         useFactory: () => {
            AWS.config.region = 'eu-central-1';
            return new AWS.S3({ apiVersion: '2006-03-01' });
         },
      },
   ],
})
export class AwsModule {}
