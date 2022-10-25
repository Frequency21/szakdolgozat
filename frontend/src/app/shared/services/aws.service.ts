import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AwsService {
   constructor(private http: HttpClient) {}

   public getSignedUrl(fileName: string, fileType: string) {
      return this.http.get<{ signedRequest: string; url: string }>(
         '/api/aws/sign-s3',
         {
            params: {
               'file-name': fileName,
               'file-type': fileType,
            },
            observe: 'response',
         },
      );
   }
}
