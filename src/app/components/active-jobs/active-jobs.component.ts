import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { JobDetailsComponent } from '../job-details/job-details.component';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-active-jobs',
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
  templateUrl: './active-jobs.component.html',
  styleUrl: './active-jobs.component.scss',
})
export class ActiveJobsComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'title',
    'industryName',
    'expiryDate',
    'city',
    'status',
    'actions',
  ];

  dataTable = {
    filters: {
      status: true,
      applicantId: '00000000-0000-0000-0000-000000000000',
    },
    searchValue: '',
    sortColumn: 'title',
    sortOrder: 'asc',
    length: 0,
    pageSize: 5,
    pageNo: 0,
    status: true,
    pageIndex: 0,
  };

  dataSource = new MatTableDataSource<Job>([]);
  activeJobs: Job[] = [];
  totalCount: number = 0;
  EnterSearchValue: string = '';
  selectedJob: any = {};
  modalInstance!: Modal;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(JobDetailsComponent) jobModal!: JobDetailsComponent;

  constructor(
    private jobService: JobService,
    private toastr: ToastrService,
    private pagingService: PagingService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.getEmployerJobs();
  }

  OnSearchTextChange() {
    this.dataTable.searchValue = this.EnterSearchValue;
    this.getEmployerJobs();
  }

  getPagingSizeIntervals(): number[] {
    return this.pagingService.getPagingSizeIntervals();
  }

  tableSortChange(event: any) {
    console.log('Sort Event', event);
    this.dataTable.sortColumn = event.active;
    this.dataTable.sortOrder = event.direction;
    this.getEmployerJobs();
  }

  handlePage(event: PageEvent) {
    this.dataTable.pageIndex = event.pageIndex;
    this.dataTable.pageSize = event.pageSize;
    this.getEmployerJobs();
  }

  applyFilter(value: string): void {
    console.log('applyfilter', value);
    this.dataSource.filter = value;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getEmployerJobs(): void {
    this.dataTable.pageNo = this.dataTable.pageIndex + 1;

    this.jobService.getEmployerJobs(this.dataTable).subscribe({
      next: (res) => {
        console.log('res', res.result);
        this.activeJobs = res.result.items;
        this.totalCount = res.result.totalCount;
        this.dataTable.length = this.totalCount;
        console.log('dataTable.length', this.dataTable.length);
        this.dataSource.data = this.activeJobs;
        console.log('dataSource', this.dataSource.data);
      },
      error: () => this.toastr.error('Failed to get jobs'),
    });
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
        this.getEmployerJobs();
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
        this.dataTable.pageNo = 0;
        this.dataTable.pageSize = 5;
        this.getEmployerJobs();
      },
      error: (err: any) => {
        this.toastr.error('Job application unsuccessfull');
      },
    });
  }

  editJob(jobId: number): void {
    console.log('EditJobCalled', jobId);
    this.router.navigate(['/editjob', jobId]);
  }

  openModal(index: any) {
    this.selectedJob = this.activeJobs[index];
    this.modalInstance.show();
  }

  closeModal() {
    this.modalInstance.hide();
  }

  openJobDetails(index: number) {
    console.log('index', index);
    this.selectedJob = this.activeJobs[index];
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
  
  handleLink(job: any){
    this.copyJobLink(job.jobId);
  }

  copyJobLink(jobId: number): void {
    const url = `${location.origin}/job/${jobId}`; // public route (see step 2)

    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => this.toastr.success('Link copied'))
        .catch(() => this.fallbackCopy(url));
    } else {
      this.fallbackCopy(url);
    }
  }

  private fallbackCopy(text: string) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      this.toastr.show('Link copied');
    } catch {}
    document.body.removeChild(ta);
  }
}
