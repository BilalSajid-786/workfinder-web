import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { JobService } from '../../services/job.service';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';
import { Job } from '../../models/job.model';
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
import { ToastrService } from 'ngx-toastr';
import { JobDetailsComponent } from '../job-details/job-details.component';
import { FormsModule } from '@angular/forms';
import { ChatPannelComponent } from '../chat-pannel/chat-pannel.component';
import { CountryService } from '../../services/country.service';
import { IndustryService } from '../../services/industry.service';
import { Industry } from '../../models/industry.model';

@Component({
  selector: 'app-available-jobs',
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
    FormsModule,
    ChatPannelComponent,
  ],
  templateUrl: './available-jobs.component.html',
  styleUrl: './available-jobs.component.scss',
})
export class AvailableJobsComponent implements AfterViewInit {
  jobTypes: any[] = [];
  // Selected values
  selectedJobType = '';
  selectedIndustry = '';
  selectedCountry = '';
  availableJobs: Job[] = [];
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
  filters: any = {};
  industries: Industry[] = [];
  countries: any[] = [];
  selectedUserId: any = null;
  chatMessages: { sender: string; text: string }[] = [];

  ngAfterViewInit() {
    // this.modalInstance = new Modal(this.modalElement.nativeElement);
  }

  /**
   *
   */
  constructor(
    private jobService: JobService,
    private toastr: ToastrService,
    private countryService: CountryService,
    private industryService: IndustryService
  ) {
    this.GetAvailableJobs(this.pageNo, this.pageSize);
    this.GetJobTypes();
    this.getIndustries();
    this.getCountries();
  }

  GetJobTypes() {
    this.jobService.GetJobTypes().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.jobTypes = res.result.flat();
        } else {
          this.jobTypes = [];
        }
      },
      error: (err) => {
        console.error('Error fetching jobTypes:', err);
        this.jobTypes = [];
      },
    });
  }

  getCountries() {
    this.countryService.getCountries().subscribe((list) => {
      this.countries = list.result ?? [];
    });
  }

  getIndustries(): void {
    this.industryService.getIndustries().subscribe((list) => {
      this.industries = list ?? [];
    });
  }

  onFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    console.log('Selected rating:', value);
    this.pageNo = 1;
    this.pageSize = 2;
    this.filters = {
      ...this.filters,
      jobType: this.selectedJobType,
      industryId: this.selectedIndustry == '' ? null : this.selectedIndustry,
      location: this.selectedCountry,
    };
    this.GetAvailableJobs(this.pageNo, this.pageSize, this.filters);
  }

  openChat(user: any) {
    debugger;
    this.selectedUserId = user;

    // Example initial messages
    this.chatMessages = [
      { sender: 'user', text: 'Hi, is this job still available?' },
      { sender: 'me', text: 'Yes, please apply through the link!' },
    ];
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

  applyJob(selectedJob: Job) {
    this.jobService.ApplyJob({ jobId: selectedJob.jobId }).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        this.closeModal();
        this.pageNo = 1;
        this.pageSize = 2;
        this.GetAvailableJobs(this.pageNo, this.pageSize);
      },
      error: (err: any) => {
        this.toastr.error('Job application unsuccessfull');
      },
    });
  }

  GetAvailableJobs(
    pageNo: number,
    pageSize: number,
    filters: any = null
  ): void {
    this.jobService
      .GetAvailableJobs({ pageNo, pageSize, filters })
      .subscribe((list) => {
        this.availableJobs = list.result.items ?? [];
        this.dataSource.data = this.availableJobs;
        this.totalJobs = list.result.totalCount;
        this.pageNo = list.result.pageNumber;
        this.pageSize = list.result.pageSize;
      });
  }

  applyFilter(value: string): void {
    this.dataSource.filter = value;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  SaveJob(jobId: number): void {
    this.jobService.SaveJob({ jobId }).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        this.pageNo = 1;
        this.pageSize = 2;
        this.GetAvailableJobs(this.pageNo, this.pageSize);
      },
      error: (err: any) => {
        this.toastr.error('Job save unsuccessfull');
      },
    });
  }

  ApplyJob(jobId: number): void {
    this.jobService.ApplyJob({ jobId }).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        this.pageNo = 1;
        this.pageSize = 2;
        this.GetAvailableJobs(this.pageNo, this.pageSize);
      },
      error: (err: any) => {
        this.toastr.error('Job application unsuccessfull');
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNo = event.pageIndex + 1; // MatPaginator is 0-indexed
    this.pageSize = event.pageSize;
    this.GetAvailableJobs(this.pageNo, this.pageSize, this.filters);
  }

  openModal(index: number) {
    this.selectedJob = this.availableJobs[index];
    this.modalInstance.show();
  }

  closeModal() {
    this.modalInstance.hide();
  }

  openJobDetails(index: number) {
    this.selectedJob = this.availableJobs[index];
    this.jobModal.openModal();
  }

  handleSave(job: any) {
    this.SaveJob(job.jobId);
  }

  handleApply(job: any) {
    this.ApplyJob(job.jobId);
  }
}
