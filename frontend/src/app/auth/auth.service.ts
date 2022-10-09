import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({
   providedIn: 'root',
})
export class AuthService {
   readonly loggedIn = new BehaviorSubject<boolean>(false);

   loggedIn$ = this.loggedIn.asObservable();

   constructor(private http: HttpClient) {}

   autoLogin(): void {
      this.http
         .get('/api/auth', { observe: 'response' })
         .pipe(map(resp => resp.ok))
         .subscribe({
            next: isAuthenticated => {
               this.loggedIn.next(isAuthenticated);
            },
            error: _error => this.loggedIn.next(false),
         });
   }

   register(
      name: string,
      email: string,
      password: string,
   ): Observable<boolean> {
      return this.http
         .post(
            '/api/auth/register',
            {
               name,
               email,
               password,
            },
            { observe: 'response' },
         )
         .pipe(map(resp => resp.ok));
   }

   login(email: string, password: string): Observable<boolean> {
      return this.http
         .post(
            '/api/auth/login',
            {
               email,
               password,
            },
            { observe: 'response' },
         )
         .pipe(
            map(resp => resp.ok),
            tap(loggedIn => this.loggedIn.next(loggedIn)),
         );
   }

   logout(): Observable<boolean> {
      return this.http.delete('/api/auth/logout', { observe: 'response' }).pipe(
         map(resp => resp.ok),
         tap({
            next: loggedOut => this.loggedIn.next(!loggedOut),
            error: _ => this.loggedIn.next(false),
         }),
      );
   }
}
