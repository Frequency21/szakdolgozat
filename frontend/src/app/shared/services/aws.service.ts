import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AwsService {
   constructor(private http: HttpClient) {}

   public getSignedUrl() {
      return this.http.get<{ signedUrl: string; url: string }>(
         '/api/aws/sign-s3',
         {
            observe: 'response',
         },
      );
   }
}
