import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Message } from 'src/app/models/message.model';

@Injectable({ providedIn: 'root' })
export class MessagesService {
   constructor(private http: HttpClient) {}

   getMessagesFrom(from: number) {
      return this.http.get<Message[]>(`/api/message/${from}`);
   }

   sendMessage(to: number, text: string) {
      return this.http
         .post<boolean>(
            `/api/message/${to}`,
            {
               text,
            },
            { observe: 'response' },
         )
         .pipe(map(resp => resp.ok));
   }
}
