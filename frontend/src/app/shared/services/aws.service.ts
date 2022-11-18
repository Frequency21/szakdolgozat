import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type SignedUrl = {
   signedUrl: string;
   url: string;
};

@Injectable({ providedIn: 'root' })
export class AwsService {
   constructor(private http: HttpClient) {}

   public getSignedUrl() {
      return this.http.get<SignedUrl>('/api/aws/sign-s3', {
         observe: 'response',
      });
   }

   public getSignedUrls(fileNames: string[]) {
      return this.http.post<SignedUrl[]>('/api/aws/sign-product-pictures', {
         fileNames,
      });
   }
}
