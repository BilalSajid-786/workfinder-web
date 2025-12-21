import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Job } from '../../models/job.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Modal } from 'bootstrap';
import { JobService } from '../../services/job.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JobDetailsComponent } from '../job-details/job-details.component';
import { ChatPannelComponent } from '../chat-pannel/chat-pannel.component';

@Component({
  selector: 'app-applied-jobs',
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
    ChatPannelComponent,
  ],
  templateUrl: './applied-jobs.component.html',
  styleUrls: ['./applied-jobs.component.scss'],
})
export class AppliedJobsComponent {
  appliedJobs: Job[] = [];
  selectedJob: any = {};
  dataSource = new MatTableDataSource<Job>([]);
  totalJobs: number = 0;
  pageSize = 5;
  pageNo = 1;
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
    'status',
    'actions',
  ];
  sortOrder: string = 'ASC';
  sortColumn: string = 'Title';
  selectedUserId: any = null;
  selectedUserName: string = '';
  chatMessages: { sender: string; text: string }[] = [];

  /**
   *
   */
  constructor(
    private jobService: JobService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
    this.GetAppliedJobs(this.pageNo, this.pageSize);
  }

  GetAppliedJobs(pageNo: number, pageSize: number): void {
    var sortColumn = this.sortColumn;
    var sortOrder = this.sortOrder;
    this.jobService
      .GetAppliedJobs({ pageNo, pageSize, sortColumn, sortOrder })
      .subscribe((list) => {
        this.appliedJobs = list.result.items ?? [];
        this.dataSource.data = this.appliedJobs;
        this.totalJobs = list.result.totalCount;
        this.pageNo = list.result.pageNumber;
        this.pageSize = list.result.pageSize;
      });
  }

  openChat(user: any) {
    this.selectedUserId = user.employerId;
    this.selectedUserName = user.company;
  }

  handleMessageSend(messageText: any) {
    this.chatMessages.push({ sender: 'me', text: messageText });

    // Simulate a reply
    setTimeout(() => {
      this.chatMessages.push({
        sender: 'user',
        text: 'Thank you! Ill check it out.',
      });
    }, 1000);
    console.log('message to sent', this.chatMessages);
  }

  onPageChange(event: PageEvent) {
    this.pageNo = event.pageIndex + 1; // MatPaginator is 0-indexed
    this.pageSize = event.pageSize;
    this.GetAppliedJobs(this.pageNo, this.pageSize);
  }

  tableSortChange(event: any) {
    console.log('Sort Event', event);
    this.sortColumn = event.active;
    this.sortOrder = event.direction;
    this.GetAppliedJobs(this.pageNo, this.pageSize);
  }

  applyFilter(value: string): void {
    this.dataSource.filter = value;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openJobDetails(index: number) {
    this.selectedJob = this.appliedJobs[index];
    this.jobModal.openModal();
  }

  handleSave(job: any) {
    this.toastr.success(`Job '${job.title}' saved successfully!`);
  }

  handleApply(job: any) {
    this.toastr.success(`You have already applied for '${job.title}'.`);
  }

  openModal(index: number) {
    this.selectedJob = this.appliedJobs[index];
    this.modalInstance.show();
  }

  closeModal() {
    this.modalInstance.hide();
  }
}
