import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { JobService } from '../../services/job.service';
import { CommonModule } from '@angular/common';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-available-jobs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './available-jobs.component.html',
  styleUrl: './available-jobs.component.scss',
})
export class AvailableJobsComponent implements AfterViewInit {
  availableJobs: any[] = [];
  selectedJob: any = {};
  @ViewChild('exampleModal') modalElement!: ElementRef;
  modalInstance!: Modal;

  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
  }

  /**
   *
   */
  constructor(private jobService: JobService) {
    this.GetAvailableJobs();
  }

  GetAvailableJobs(): void {
    this.jobService.GetAvailableJobs({}).subscribe((list) => {
      console.log('result is ', list);
      this.availableJobs = list.result ?? [];
    });
  }

  openModal(index: number) {
    this.selectedJob = this.availableJobs[index];
    this.modalInstance.show();
  }

  closeModal() {
    this.modalInstance.hide();
  }
}
