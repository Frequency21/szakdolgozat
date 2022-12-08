import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { pluck, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { RatingsStatistics, UserService } from '../user/user.service';

@Component({
   selector: 'app-profile',
   templateUrl: './profile.component.html',
   styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnDestroy {
   statistics?: RatingsStatistics;

   destroyed$ = new ReplaySubject<void>(1);

   constructor(
      private route: ActivatedRoute,
      private userService: UserService,
   ) {
      this.route.params
         .pipe(
            takeUntil(this.destroyed$),
            pluck('id'),
            switchMap(id => this.userService.profileStatistics(id)),
            takeUntil(this.destroyed$),
         )
         .subscribe(profileData => (this.statistics = profileData));
   }

   ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
   }
}
