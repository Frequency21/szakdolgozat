import {
   BadRequestException,
   Controller,
   Get,
   Inject,
   InternalServerErrorException,
   Logger,
   Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { AWS_S3 } from 'src/aws/aws.const';

/* Hivatkozások: https://devcenter.heroku.com/articles/s3-upload-node */
@Controller('aws')
export class AwsController {
   bucket = this.configService.get('S3_BUCKET');

   constructor(
      @Inject(AWS_S3) private s3: S3,
      private configService: ConfigService,
   ) {}

   @Get('sign-s3')
   getSignedUrl(
      @Query('file-name') fileName?: string,
      @Query('file-type') fileType?: string,
   ) {
      // error-handling
      if (!this.s3 || !this.bucket) {
         throw new InternalServerErrorException();
      }
      if (!fileName || !fileType) {
         throw new BadRequestException();
      }

      const filePath = 'images/' + fileName;
      const s3Params = {
         Bucket: this.bucket,
         Key: filePath,
         Expires: 60,
         ContentType: fileType,
         ACL: 'public-read',
      };

      return new Promise((res, rej) => {
         this.s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if (err) {
               Logger.error(err, 'AWS');
               return rej(err);
            }
            const returnData = {
               signedRequest: data,
               url: `https://${this.bucket}.s3.amazonaws.com/${filePath}`,
            };
            return res(returnData);
         });
      });
   }
}
