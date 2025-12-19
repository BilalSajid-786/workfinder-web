import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { JobService } from '../services/job.service';
import { catchError, EMPTY } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class JobResolver implements Resolve<any> {
  constructor(private jobs: JobService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot) {
    const id = Number(route.paramMap.get('id'));
    return this.jobs.getJobById(id).pipe(
      catchError((err) => {
        // If unauthorized/forbidden, go to login and come back
        if (err?.status === 401 || err?.status === 403) {
          this.router.navigate(['/'], { queryParams: { returnUrl: this.router.url } });
        } else {
          this.router.navigate(['/']); // optional
        }
        return EMPTY;
      })
    );
  }
}
