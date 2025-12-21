import {ChangeDetectionStrategy, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { JobService } from '../../services/job.service';
import { ToastrService } from 'ngx-toastr';
import { Job } from '../../models/job.model';
import { PagingService } from '../../services/paging.service';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule, NumberSymbol } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { JobDetailsComponent } from '../job-details/job-details.component';
import { Modal } from 'bootstrap';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-job-shell',
  standalone: true,
  imports: [
    JobDetailsComponent,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSlideToggleModule,
    RouterModule,
  ],
  templateUrl: './job-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './job-shell.component.scss',
})
export class JobShellComponent implements OnInit {
  displayedColumns: string[] = [
    'title',
    'industryName',
    'expiryDate',
    'city',
    'status',
    'actions',
  ];

  dataSource = new MatTableDataSource<Job>([]);
  job!: Job;
  role: 'Admin' | 'Employer' | 'Applicant' | null = null;
  selectedJob: any = {};
  componentName: string = "";
  modalInstance!: Modal;

  @ViewChild(JobDetailsComponent) jobModal!: JobDetailsComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private jobService: JobService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Prefer resolver data (fast), fallback to param fetch
    const resolved = this.route.snapshot.data['job'];
    debugger;
    this.role = this.auth.getRole() as any;
    console.log("role", this.role);
    if(this.role == "Employer"){
      this.componentName = "JobShellEmployer";
    }
    else{
      this.componentName = "JobShellApplicant";
    }

    if (resolved?.result) {
      console.log('if resolved', resolved.result);
      if (resolved.result.isActive) {
        this.job = resolved.result as Job;
        this.dataSource.data = this.job ? [this.job] : [];
        console.log('dataSource.data', this.dataSource.data);
      }
    } 
    else {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id) {
        this.jobService.getJobById(id).subscribe({
          next: (res: any) =>
            (this.job = res.result.isActive ?? (res.result as Job)),
          error: () => this.toastr.error('Failed to load job'),
        });
        console.log('Job2', this.job);
        //this.openJobDetails(this.job);
      }
    }
  }

  onToggleStatus(job: Job, checked: boolean) {
    console.log('Job', job);
    console.log('checked', checked);
    var jobId = job.jobId;
    var status = !job.isActive;
    debugger;
    this.jobService.UpdateJobStatus(jobId, status).subscribe({
      next: (res) => {
        this.toastr.success('Job status updated.');
        //this.getEmployerJobs();
      },
      error: () => this.toastr.error('Failed to update status.'),
    });
  }

  deleteJob(jobId: number): void {
    console.log('DeleteJobCalled', jobId);
    this.jobService.deleteJob(jobId).subscribe({
      next: (res: any) => {
        console.log('res', res);
        this.toastr.success(res.message);
        // this.dataTable.pageNo = 0;
        // this.dataTable.pageSize = 5;
        // this.getEmployerJobs();
      },
      error: (err: any) => {
        this.toastr.error('Job application unsuccessfull');
      },
    });
  }

  openModal(index: any) {
    this.selectedJob = this.job;
    this.modalInstance.show();
  }

  closeModal() {
    this.modalInstance.hide();
  }

  openJobDetails(index: number) {
    console.log('index', index);
    this.selectedJob = this.job;
    console.log(' this.selectedJob', this.selectedJob);
    this.jobModal.openModal();
  }

  updateStatus(job: any) {
    console.log('Jobevent', job);
    this.onToggleStatus(job, job.isActive);
  }

  handleDelete(job: any) {
    console.log('Delete', job);
    this.deleteJob(job.jobId);
  }
}
