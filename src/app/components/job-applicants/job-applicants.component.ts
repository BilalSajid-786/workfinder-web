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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-job-applicants',
  standalone: true,
  imports: [
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
    MatButtonToggleModule,
  ],
  templateUrl: './job-applicants.component.html',
  styleUrl: './job-applicants.component.scss',
})
export class JobApplicantsComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'city',
    'country',
    'phone',
    'resume',
    'actions'
  ];

  dataTable = {
    filters: {
      applicantStatus: 'applied',
      jobId: 0
    },
    searchValue: '',
    sortColumn: 'name',
    sortOrder: 'asc',
    length: 0,
    pageSize: 5,
    pageNo: 0,
    status: true,
    pageIndex: 0
  };

  jobId: number = 0;
  jobRow: any;
  selectedTab: 'applied' | 'shortlisted' | 'hired' | 'reviewed' | 'rejected' = 'applied';

  dataSource = new MatTableDataSource<any>([]);
  jobApplicants: any[] = [];
  totalCount: number = 0;
  EnterSearchValue: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private toastr: ToastrService,
    private pagingService: PagingService
  ) {
    this.jobId = Number(this.route.snapshot.paramMap.get('jobId'));
    this.jobRow = this.router.getCurrentNavigation()?.extras?.state?.['job'] ?? window.history.state?.job;
    console.log("JobId", this.jobId);
    console.log("jobRow", this.jobRow);
  }

  ngAfterViewInit(): void {
    this.dataTable.filters.jobId = this.jobId;
    this.getJobApplicants();
  }

  OnSearchTextChange() {
    this.dataTable.searchValue = this.EnterSearchValue;
    this.getJobApplicants();
  }

  getPagingSizeIntervals(): number[] {
    return this.pagingService.getPagingSizeIntervals();
  }

  tableSortChange(event: any) {
    console.log('Sort Event', event);
    this.dataTable.sortColumn = event.active;
    this.dataTable.sortOrder = event.direction;
    this.getJobApplicants();
  }

  handlePage(event: PageEvent) {
    this.dataTable.pageIndex = event.pageIndex;
    this.dataTable.pageSize = event.pageSize;
    this.getJobApplicants();
  }

  applyFilter(value: string): void {
    console.log('applyfilter', value);
    this.dataSource.filter = value;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getJobApplicants(): void {
    this.dataTable.pageNo = this.dataTable.pageIndex + 1;

    this.jobService.getJobApplicants(this.dataTable).subscribe({
      next: (res) => {
        console.log('res', res);
        this.jobApplicants = res.result.items;
        this.totalCount = res.result.totalCount;
        this.dataTable.length = this.totalCount;
        //console.log('activeJobs', this.activeJobs);
        this.dataSource.data = this.jobApplicants;
        //console.log('dataSource', this.dataSource.data);
      },
      error: () => this.toastr.error('Failed to get jobs'),
    });
  }

  onTabChange(value: typeof this.selectedTab) {
    this.selectedTab = value;
    this.dataTable.filters.applicantStatus = value; // pass to API
    this.dataTable.pageIndex = 0; // usually reset to first page
    this.getJobApplicants();
  }

  updateJobApplicantStatus(row: any, status: string){
    console.log("Row", row);
    console.log("status", status);
    const payload: any ={
      applicantId: row.applicantId,
      jobId: this.jobId,
      applicantStatus: status
    };
    console.log("payload", payload);
    this.jobService.updateJobApplicantStatus(payload).subscribe({
      next: (res) => {
        console.log("res", res);
        this.toastr.success('Applicant status updated.');
        this.getJobApplicants();
      },
      error: () => this.toastr.error('Failed to update status.'),
    });
  }
}
