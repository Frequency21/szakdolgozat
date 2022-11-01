import {
   AfterViewInit,
   Component,
   ElementRef,
   OnInit,
   ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
   selector: 'app-messages',
   templateUrl: './messages.component.html',
   styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, AfterViewInit {
   users = [
      { name: 'John Doe' },
      { name: 'John Doe' },
      { name: 'John Doe' },
      { name: 'John Doe' },
      { name: 'John Doe' },
      { name: 'John Doe' },
      { name: 'John Doe' },
      { name: 'John Doe' },
      { name: 'John Doe' },
      { name: 'John Doe' },
      { name: 'John Doe' },
      { name: 'John Doe' },
      { name: 'John Doe' },
   ].map((v, i) => ({ ...v, id: i }));

   selectedUserId?: number;

   @ViewChild('messagePanel', { static: true })
   messagePanel!: ElementRef<Element>;

   constructor(private router: Router, private route: ActivatedRoute) {
      this.route.params.subscribe(params => {
         this.selectedUserId = +params['userId'];
         console.log('selectedUserId', this.selectedUserId);
      });
   }

   ngOnInit(): void {}

   ngAfterViewInit(): void {
      const element = this.messagePanel.nativeElement;
      setTimeout(() => {
         element.scrollTo({
            left: 0,
            top: element.scrollHeight,
            behavior: 'smooth',
         });
      }, 100);
   }

   selectUser(index: number) {
      this.router.navigate(['users', 'messages', index]);
   }
}
