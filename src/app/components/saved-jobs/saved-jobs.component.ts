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
import { ConfirmationPopupComponent } from '../shared/confirmation-popup/confirmation-popup.component';

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
    ConfirmationPopupComponent,
  ],
  templateUrl: './saved-jobs.component.html',
  styleUrl: './saved-jobs.component.scss',
})
export class SavedJobsComponent implements AfterViewInit {
  savedJobs: Job[] = [];
  selectedJob: any = {};
  dataSource = new MatTableDataSource<Job>([]);
  totalJobs: number = 0;
  pageSize = 5;
  pageNo = 1;
  @ViewChild('exampleModal') modalElement!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(JobDetailsComponent) jobModal!: JobDetailsComponent;
  @ViewChild(ConfirmationPopupComponent)
  confirmationModal!: ConfirmationPopupComponent;
  modalInstance!: Modal;
  displayedColumns: string[] = [
    'title',
    'company',
    'postedDate',
    'location',
    'jobType',
    'actions',
  ];
  sortOrder: string = 'ASC';
  sortColumn: string = 'Title';

  ngAfterViewInit() {
    // this.modalInstance = new Modal(this.modalElement.nativeElement);
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

  tableSortChange(event: any) {
    console.log('Sort Event', event);
    this.sortColumn = event.active;
    this.sortOrder = event.direction;
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

  unSaveJob(index: number) {
    var job = this.savedJobs[index];
  }

  handleApply(job: any) {
    this.ApplyJob(job.jobId);
  }

  GetUnSaveJobConfirmation(index: number) {
    this.confirmationModal.openConfirmationModal(
      'unsave',
      this.savedJobs[index].jobId
    );
  }

  ApplyJob(jobId: number): void {
    this.jobService.ApplyJob({ jobId }).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        this.pageNo = 1;
        this.pageSize = 5;
        this.GetSavedJobs(this.pageNo, this.pageSize);
      },
      error: (err: any) => {
        this.toastr.error('Job application unsuccessfull');
      },
    });
  }

  handleConfirmation(selectedJob: any) {
    if (selectedJob > 0) this.UnSaveJob(selectedJob);
  }

  UnSaveJob(jobId: number): void {
    this.jobService.UnSaveJob({ jobId }).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        this.pageNo = 1;
        this.pageSize = 5;
        this.GetSavedJobs(this.pageNo, this.pageSize);
      },
      error: (err: any) => {
        this.toastr.error('Job save unsuccessfull');
      },
    });
  }

  GetSavedJobs(pageNo: number, pageSize: number): void {
    var sortColumn = this.sortColumn;
    var sortOrder = this.sortOrder;
    this.jobService
      .GetSavedJobs({ pageNo, pageSize, sortColumn, sortOrder })
      .subscribe((list) => {
        this.savedJobs = list.result.items ?? [];
        this.dataSource.data = this.savedJobs;
        this.totalJobs = list.result.totalCount;
        this.pageNo = list.result.pageNumber;
        this.pageSize = list.result.pageSize;
      });
  }
}
