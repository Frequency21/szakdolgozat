import {
   Component,
   ElementRef,
   OnDestroy,
   OnInit,
   ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, map, ReplaySubject, switchMap, takeUntil, tap } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { MessagesService } from 'src/app/shared/services/messages.service';
import {
   Partner,
   WebsocketService,
} from 'src/app/shared/services/websocket.service';

@Component({
   selector: 'app-messages',
   templateUrl: './messages.component.html',
   styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, OnDestroy {
   partners?: Partner[];

   selectedUserId?: number;

   @ViewChild('messagePanel', { static: true })
   messagePanel!: ElementRef<Element>;

   messages?: Message[];

   destroyed$ = new ReplaySubject<void>(1);

   constructor(
      private router: Router,
      private route: ActivatedRoute,
      private messagesService: MessagesService,
      private websocketService: WebsocketService,
   ) {
      this.route.params
         .pipe(
            takeUntil(this.destroyed$),
            map(params => {
               let userId: number = Number(params['userId']);
               return Number.isNaN(userId) ? undefined : userId;
            }),
            tap(userId => (this.selectedUserId = userId)),
            switchMap(userId => {
               if (userId === undefined) {
                  return EMPTY;
               }
               return this.messagesService.getMessagesFrom(userId);
            }),
            takeUntil(this.destroyed$),
         )
         .subscribe(messages => {
            this.scrollToBottom(true);
            return (this.messages = messages);
         });
      this.websocketService.partners$
         .pipe(takeUntil(this.destroyed$))
         .subscribe(partners => (this.partners = partners));
      this.websocketService.incomingMessage$
         .pipe(takeUntil(this.destroyed$))
         .subscribe(message => {
            if (message.from !== this.selectedUserId) {
               const partner = this.partners!.find(p => p.id === message.from);

               // TODO: új üzenet jött olyantól, aki még nincs a partner listán
               if (!partner) {
                  this.websocketService.refreshPartners();
                  return;
               }

               partner.unseenMessages += 1;
            } else {
               this.messages!.push({
                  seen: true,
                  self: false,
                  // TODO: rendes sent date
                  sent: new Date(),
                  text: message.text,
               });
               this.scrollToBottom();
            }
         });
   }

   private scrollToBottom(smooth = false) {
      const element = this.messagePanel.nativeElement;
      setTimeout(() => {
         if (!element) return;
         element.scrollTo({
            left: 0,
            top: element.scrollHeight,
            ...{ ...(smooth ? { behavior: 'smooth' } : null) },
         });
      });
   }

   ngOnInit(): void {}

   ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
   }

   selectUser(partner: Partner) {
      if (partner.id === this.selectedUserId) {
         this.router.navigate(['users', 'messages']);
         return;
      }
      partner.unseenMessages = 0;
      this.websocketService.seenMessages(partner.id);
      this.router.navigate(['users', 'messages', partner.id]);
   }

   send(text: string, textArea: HTMLTextAreaElement) {
      if (this.selectedUserId === undefined || !textArea.value) {
         return;
      }
      this.messagesService
         .sendMessage(this.selectedUserId, text)
         .subscribe(success => {
            if (success) {
               textArea.value = '';
               this.messages!.push({
                  text,
                  self: true,
                  seen: false,
                  sent: new Date(),
               });
            }
            this.scrollToBottom();
         });
   }
}
