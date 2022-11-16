import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
   Inject,
   Injectable,
   InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { S3_CLIENT } from './aws.const';

@Injectable()
export class AwsService {
   private bucket = this.configService.get('S3_BUCKET');

   constructor(
      @Inject(S3_CLIENT) private s3Client: S3Client,
      private configService: ConfigService,
   ) {}

   async signUrl(fileUrl: string) {
      // error-handling
      if (!this.s3Client || !this.bucket) {
         throw new InternalServerErrorException();
      }

      const signedUrl = await getSignedUrl(
         this.s3Client,
         new PutObjectCommand({
            Bucket: this.bucket,
            Key: 'images/' + fileUrl,
            ACL: 'public-read',
         }),
      );

      return { signedUrl, url: signedUrl.split('?')[0] };
   }

   async signUrls(folderName: string, fileNames: string[]) {
      // error-handling
      if (!this.s3Client || !this.bucket) {
         throw new InternalServerErrorException();
      }

      const fileNameHashes = fileNames.map((name) => {
         return {
            name,
            hash: createHash('sha512')
               .update(name + Date.now(), 'binary')
               .digest('hex'),
         };
      });

      return await Promise.all(
         fileNameHashes.map(async (fileNameHash) => {
            const signedUrl = await getSignedUrl(
               this.s3Client,
               new PutObjectCommand({
                  Bucket: this.bucket,
                  Key: `images/${folderName}/${fileNameHash.hash}`,
                  ACL: 'public-read',
               }),
            );
            return {
               name: fileNameHash.name,
               signedUrl,
               url: signedUrl.split('?')[0],
            };
         }),
      );
   }
}
