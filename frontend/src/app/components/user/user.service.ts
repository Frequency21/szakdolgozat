import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UpdateUserDto, User } from 'src/app/models/user.model';

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

   updateUser(updateUserDto: UpdateUserDto) {
      return this.http.post<User>('/api/user', updateUserDto);
   }
}
