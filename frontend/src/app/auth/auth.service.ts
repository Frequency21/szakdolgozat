import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { LoginData } from '../models/user.model';

@Injectable({
   providedIn: 'root',
})
export class AuthService {
   private readonly user$$ = new BehaviorSubject<LoginData | null>(null);

   loggedIn$ = this.user$$.pipe(map(user => user != null));
   user$ = this.user$$.pipe();

   constructor(private http: HttpClient) {}

   get loggedIn() {
      return this.user$$.value != null;
   }

   get user() {
      return this.user$$.value;
   }

   set user(user: LoginData | null) {
      this.user$$.next(user);
   }

   updateUser(partialUser: Partial<LoginData>) {
      const currentUser = this.user;
      this.user$$.next(currentUser ? { ...currentUser, ...partialUser } : null);
   }

   autoLogin(): void {
      this.http.get<LoginData | null>('/api/auth').subscribe({
         next: user => {
            return this.user$$.next(user);
         },
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
         .post<LoginData | null>('/api/auth/google-sign-in', { jwt })
         .pipe(tap(user => this.user$$.next(user)));
   }

   login(email: string, password: string): Observable<LoginData | null> {
      return this.http
         .post<LoginData | null>('/api/auth/login', {
            email,
            password,
         })
         .pipe(tap(user => this.user$$.next(user)));
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
