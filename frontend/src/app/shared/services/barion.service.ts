import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pluck } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BarionService {
   constructor(private httpClient: HttpClient) {}

   initializePayment(productIds: number[]) {
      return this.httpClient
         .post<{ barionGatewayUrl: string }>('/api/barion', {
            productIds,
         })
         .pipe(pluck('barionGatewayUrl'));
   }
}
