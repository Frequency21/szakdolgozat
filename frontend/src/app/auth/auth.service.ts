import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
   providedIn: 'root',
})
export class AuthService {
   private readonly user$$ = new BehaviorSubject<User | null>(null);

   loggedIn$ = this.user$$.pipe(map(user => user != null));
   user$ = this.user$$.pipe();

   constructor(private http: HttpClient) {}

   get loggedIn() {
      return this.user$$.value != null;
   }

   autoLogin(): void {
      this.http.get<User | null>('/api/auth').subscribe({
         next: user => this.user$$.next(user),
         error: () => this.user$$.next(null),
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

   googleSignIn(jwt: string) {
      return this.http
         .post<User | null>('/api/auth/google-sign-in', { jwt })
         .pipe(tap(user => this.user$$.next(user)));
   }

   login(email: string, password: string): Observable<boolean> {
      return this.http
         .post<User | null>('/api/auth/login', {
            email,
            password,
         })
         .pipe(
            tap(user => this.user$$.next(user)),
            map(user => user != null),
         );
   }

   deleteSession() {
      // delete storage if any
      this.user$$.next(null);
   }

   logout(): Observable<boolean> {
      return this.http.delete('/api/auth/logout', { observe: 'response' }).pipe(
         map(resp => resp.ok),
         tap({
            next: loggedOut => loggedOut && this.user$$.next(null),
         }),
      );
   }
}
