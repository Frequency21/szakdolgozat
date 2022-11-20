import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
   selector: 'app-basket',
   templateUrl: './basket.component.html',
   styleUrls: ['./basket.component.scss'],
})
export class BasketComponent implements OnInit {
   basket$ = this.userService.basket$$;

   constructor(private userService: UserService) {}

   ngOnInit(): void {}
}
