import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
   BadRequestException,
   Controller,
   Get,
   Inject,
   InternalServerErrorException,
   Req,
   UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { CookieAuthGuard } from 'src/auth/guards/cookie-auth.guard';
import { S3_CLIENT } from 'src/aws/aws.const';

/* Hivatkozások: https://devcenter.heroku.com/articles/s3-upload-node */
/* updated to JS v3.. https://www.npmjs.com/package/@aws-sdk/s3-request-presigner */
@UseGuards(CookieAuthGuard)
@Controller('aws')
export class AwsController {
   bucket = this.configService.get('S3_BUCKET');

   constructor(
      @Inject(S3_CLIENT) private s3Client: S3Client,
      private configService: ConfigService,
   ) {}

   @Get('sign-s3')
   async getSignedUrl(@Req() request: Request) {
      // error-handling
      if (!this.s3Client || !this.bucket) {
         throw new InternalServerErrorException();
      }
      if (!request.user) {
         throw new BadRequestException();
      }

      const signedUrl = await getSignedUrl(
         this.s3Client,
         new PutObjectCommand({
            Bucket: this.bucket,
            Key: 'images/profile/' + request.user.id,
            ACL: 'public-read',
         }),
      );

      return { signedUrl, url: signedUrl.split('?')[0] };
   }
}
