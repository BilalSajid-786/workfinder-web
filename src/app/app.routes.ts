import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { PostJobComponent } from './components/post-job/post-job.component';
import { AvailableJobsComponent } from './components/available-jobs/available-jobs.component';
import { RegisterEmployerComponent } from './components/register-employer/register-employer.component';
import { RegisterApplicantComponent } from './components/register-applicant/register-applicant.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ActiveJobsComponent } from './components/active-jobs/active-jobs.component';
import { AppliedJobsComponent } from './components/applied-jobs/applied-jobs.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { InactiveJobsComponent } from './components/inactive-jobs/inactive-jobs.component';
import { SavedJobsComponent } from './components/saved-jobs/saved-jobs.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'register-employer',
        component: RegisterEmployerComponent,
      },
      {
        path: 'register-applicant',
        component: RegisterApplicantComponent,
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        data: { permissions: ['Dashboard.CanAccessDashboard'] },
      },
      {
        path: 'postjob',
        component: PostJobComponent,
        canActivate: [authGuard],
        data: { permissions: ['Job.PostJob'] },
      },
      {
        path: 'availablejobs',
        component: AvailableJobsComponent,
        canActivate: [authGuard],
        data: { permissions: ['Job.AvailableJobs'] },
      },
      {
        path: 'appliedjobs',
        component: AppliedJobsComponent,
        canActivate: [authGuard],
        data: { permissions: ['Job.AppliedJobs'] },
      },
      {
        path: 'activejobs',
        component: ActiveJobsComponent,
        canActivate: [authGuard],
        data: { permissions: ['Job.ActiveJobs'] },
      },
      {
        path: 'savedjobs',
        component: SavedJobsComponent,
        canActivate: [authGuard],
        data: { permissions: ['Job.SavedJobs'] },
      },
      {
        path: 'inactivejobs',
        component: InactiveJobsComponent,
        canActivate: [authGuard],
        data: { permissions: ['Job.InActiveJobs'] },
      },
    ],
  },
];
