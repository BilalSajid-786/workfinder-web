import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  viewChild,
  ViewChild,
} from '@angular/core';

import { JobService } from '../../services/job.service';
import { ToastrService } from 'ngx-toastr';
import { Job } from '../../models/job.model';
import { PagingService } from '../../services/paging.service';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
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
import { ChatPannelComponent } from '../chat-pannel/chat-pannel.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { MeetingService } from '../../services/meeting.service';
import { AuthService } from '../../services/auth.service';
import { Guid } from '../../models/types.model';

import { ApplicantDetailsComponent } from '../applicant-details/applicant-details.component';
import { Modal } from 'bootstrap';
import { HttpClient } from '@angular/common/http';
import { DocumentService } from '../../services/document.service';

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
    ChatPannelComponent,
    ReactiveFormsModule,
    ApplicantDetailsComponent,
  ],
  templateUrl: './job-applicants.component.html',
  styleUrl: './job-applicants.component.scss',
})
export class JobApplicantsComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'city',
    'country',
    'phone',
    'resume',
    'actions',
  ];

  dataTable = {
    filters: {
      applicantStatus: 'Applied',
      jobId: 0,
    },
    searchValue: '',
    sortColumn: 'name',
    sortOrder: 'asc',
    length: 0,
    pageSize: 5,
    pageNo: 0,
    status: true,
    pageIndex: 0,
  };

  jobId: number = 0;
  selectedUserId: any = null;
  selectedUserName: string = '';
  jobRow: any;
  selectedTab: 'Applied' | 'Shortlisted' | 'Hired' | 'Reviewed' | 'Rejected' =
    'Applied';

  dataSource = new MatTableDataSource<any>([]);
  jobApplicants: any[] = [];
  totalCount: number = 0;
  meetingUserId: Guid = '';
  EnterSearchValue: string = '';
  selectedApplicant: any = {};
  modalInstance!: Modal;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  meetingForm!: FormGroup;
  @ViewChild('meetingModal') meetingModal!: ElementRef;

  @ViewChild(ApplicantDetailsComponent)
  applicantModal!: ApplicantDetailsComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private toastr: ToastrService,
    private pagingService: PagingService,
    private docService: DocumentService,
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private authService: AuthService
  ) {
    this.jobId = Number(this.route.snapshot.paramMap.get('jobId'));
    this.jobRow =
      this.router.getCurrentNavigation()?.extras?.state?.['job'] ??
      window.history.state?.job;
    console.log('JobId', this.jobId);
    console.log('jobRow', this.jobRow);
    this.meetingForm = this.fb.group({
      meetingName: ['', Validators.required],
      startTime: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
    });
  }
  ngOnInit(): void {
    // this.modalInstance = new Modal(this.meetingModal.nativeElement);
  }

  saveMeetingUser(user: any) {
    debugger;
    console.log(user);
    this.meetingUserId = user.applicantId;

    if (this.modalInstance) {
      this.modalInstance.show();
    } else {
      console.error('Modal instance is not initialized');
    }
  }
  submitForm() {
    if (this.meetingForm.valid) {
      this.scheduleMeeting(this.meetingForm.value);

      const modalElement = document.getElementById('meetingModal');
      if (modalElement) {
        const modalInstance =
          bootstrap.Modal.getInstance(modalElement) ||
          new bootstrap.Modal(modalElement);

        modalInstance.hide();

        document.body.classList.remove('modal-open');

        const backdrops = document.getElementsByClassName('modal-backdrop');
        while (backdrops.length > 0) {
          backdrops[0].remove();
        }
      }
      console.log(this.meetingForm.value);
    } else {
      this.meetingForm.markAllAsTouched();
    }
  }

  scheduleMeeting(meetingData: any) {
    let payload = {
      Topic: meetingData.meetingName,
      StartTime: meetingData.startTime,
      Duration: meetingData.duration,
      SenderId: this.authService.getUserId(),
      ReceiverId: this.meetingUserId,
    };
    this.meetingService.ScheduleMeeting(payload).subscribe({
      next: (res: any) => {
        this.toastr.success('Meeting invite sent successfully');
        this.meetingForm.reset();
      },
      error: (err: any) => {
        this.toastr.error('Meeting Schedule Failed');
      },
    });
  }

  ngAfterViewInit(): void {
    this.dataTable.filters.jobId = this.jobId;
    this.getJobApplicants();

    // Initialize Bootstrap modal here
    if (this.meetingModal) {
      this.modalInstance = new Modal(this.meetingModal.nativeElement);
    }
  }

  OnSearchTextChange() {
    this.dataTable.searchValue = this.EnterSearchValue;
    this.getJobApplicants();
  }

  openChat(row: any) {
    this.selectedUserId = row.applicantId;
    this.selectedUserName = row.userName;
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
    console.log('DataTable', this.dataTable);

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

  updateJobApplicantStatus(row: any, status: string) {
    debugger;
    console.log('Row', row);
    console.log('status', status);
    const payload: any = {
      applicantId: row.applicantId,
      jobId: this.jobId,
      applicantStatus: status,
    };
    console.log('payload', payload);
    this.jobService.updateJobApplicantStatus(payload).subscribe({
      next: (res) => {
        console.log('res', res);
        this.toastr.success('Applicant status updated.');
        this.getJobApplicants();
      },
      error: () => this.toastr.error('Failed to update status.'),
    });
  }

  openModal(index: any) {
    this.selectedApplicant = this.jobApplicants[index];
    this.modalInstance.show();
  }

  closeModal() {
    this.modalInstance.hide();
  }

  openApplicantDetails(index: number) {
    console.log('index', index);
    this.selectedApplicant = this.jobApplicants[index];
    this.selectedApplicant.jobName = this.jobRow.title;
    this.selectedApplicant.applicantStatus =
      this.dataTable.filters.applicantStatus;
    console.log(' this.selectedApplicant', this.selectedApplicant);
    this.applicantModal.openModal();
  }

  handleApplicantStatus(applicant: any) {
    console.log('handleApplicant', applicant);
    this.updateJobApplicantStatus(applicant, applicant.applicantStatus);
  }

  handleCommunication(applicant: any) {
    console.log('handleApplicant', applicant);
  }
  // updateStatus(job: any){
  //   console.log("Jobevent", job);
  //   this.onToggleStatus(job, job.isActive);
  // }

  downloadResume(row: any): void {
    this.docService.downloadResume(row.applicantId, row.resume);
  }
}
