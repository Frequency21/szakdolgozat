import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
   providedIn: 'root',
})
export class UserService {
   constructor(private http: HttpClient) {}

   greeting(message: string): Observable<string | undefined> {
      return this.http
         .post<{ message: string }>('/api/user/greeting', {
            msg: message,
         })
         .pipe(map(resp => resp?.message));
   }
}
