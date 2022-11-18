import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CookieAuthGuard } from 'src/auth/guards/cookie-auth.guard';
import { AwsService } from './aws.service';
import { SignFilesDto } from './dto/sign-files.dto';

/* Hivatkozások: https://devcenter.heroku.com/articles/s3-upload-node */
/* updated to JS v3.. https://www.npmjs.com/package/@aws-sdk/s3-request-presigner */
@UseGuards(CookieAuthGuard)
@Controller('aws')
export class AwsController {
   constructor(private awsService: AwsService) {}

   @Post('sign-product-pictures')
   getSignedUrls(@Body() files: SignFilesDto): Promise<
      {
         name: string;
         signedUrl: string;
         url: string;
      }[]
   > {
      return this.awsService.signUrls('product', files.fileNames);
   }

   @Get('sign-s3')
   getSignedUrl(
      @Req() request: Request,
   ): Promise<{ signedUrl: string; url: string }> {
      return this.awsService.signUrl('profile/' + request.user!.id);
   }
}
