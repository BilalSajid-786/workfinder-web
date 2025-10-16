import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { JobService } from '../../services/job.service';
import { ToastrService } from 'ngx-toastr';
import { Job } from '../../models/job.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { JobDetailsComponent } from '../job-details/job-details.component';
import { Modal } from 'bootstrap';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-saved-jobs',
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
    JobDetailsComponent,
  ],
  templateUrl: './saved-jobs.component.html',
  styleUrl: './saved-jobs.component.scss',
})
export class SavedJobsComponent implements AfterViewInit {
  savedJobs: Job[] = [];
  selectedJob: any = {};
  dataSource = new MatTableDataSource<Job>([]);
  totalJobs: number = 0;
  pageSize = 2;
  pageNo = 1;
  @ViewChild('exampleModal') modalElement!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(JobDetailsComponent) jobModal!: JobDetailsComponent;
  modalInstance!: Modal;
  displayedColumns: string[] = [
    'title',
    'company',
    'postedDate',
    'location',
    'jobType',
    'actions',
  ];

  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
  }
  /**
   *
   */
  constructor(private jobService: JobService, private toastr: ToastrService) {
    this.GetSavedJobs(this.pageNo, this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.pageNo = event.pageIndex + 1; // MatPaginator is 0-indexed
    this.pageSize = event.pageSize;
    this.GetSavedJobs(this.pageNo, this.pageSize);
  }

  applyFilter(value: string): void {
    this.dataSource.filter = value;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openJobDetails(index: number) {
    this.selectedJob = this.savedJobs[index];
    this.jobModal.openModal();
  }

  GetSavedJobs(pageNo: number, pageSize: number): void {
    this.jobService.GetSavedJobs({ pageNo, pageSize }).subscribe((list) => {
      this.savedJobs = list.result.items ?? [];
      this.dataSource.data = this.savedJobs;
      this.totalJobs = list.result.totalCount;
      this.pageNo = list.result.pageNumber;
      this.pageSize = list.result.pageSize;
    });
  }
}
