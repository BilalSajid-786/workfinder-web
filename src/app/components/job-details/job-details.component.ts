import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Modal } from 'bootstrap';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule],
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss',
})
export class JobDetailsComponent implements AfterViewInit {
  @ViewChild('exampleModal') modalElement!: ElementRef;
  @ViewChild('confirmationModal') confirmationModalElement!: ElementRef;
  modalInstance!: Modal;
  confirmationModalInstance!: Modal;
  @Input() componentName: string = '';
  @Input() selectedJob: any;
  @Output() onSave = new EventEmitter<any>();
  @Output() onApply = new EventEmitter<any>();
  @Output() onToggleStatus = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onCopy = new EventEmitter<any>();
  action: string = '';

  /**
   *
   */
  constructor(private router: Router) {}

  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
    this.confirmationModalInstance = new Modal(
      this.confirmationModalElement.nativeElement
    );
  }

  openModal() {
    this.modalInstance.show();
  }

  openConfirmationModal() {
    this.confirmationModalInstance.show();
  }

  closeModal() {
    this.modalInstance.hide();
  }

  onConfirm() {
    this.confirmationModalInstance.hide();
    if (this.action == 'apply') this.onApply.emit(this.selectedJob);
    if (this.action == 'save') this.onSave.emit(this.selectedJob);
    if (this.action == 'delete') this.onDelete.emit(this.selectedJob);
    if (this.action == 'linkCopied') this.onCopy.emit(this.selectedJob);
  }

  onCancel() {
    this.confirmationModalInstance.hide();
    this.openModal();
  }

  saveJob() {
    this.action = 'save';
    this.closeModal();
    this.openConfirmationModal();
    // this.onSave.emit(this.selectedJob);
    // this.closeModal();
  }

  applyJob() {
    this.action = 'apply';
    this.closeModal();
    this.openConfirmationModal();
    // this.onApply.emit(this.selectedJob);
    // this.closeModal();
  }

  deleteJob() {
    this.action = 'delete';
    this.closeModal();
    this.openConfirmationModal();
  }

  copyLink() {
    this.action = 'linkCopied';
    this.closeModal();
    this.onConfirm();
  }

  editJob() {
    this.action = 'editJob';
    this.closeModal();
    this.router.navigate(['/editjob', this.selectedJob.jobId]);
  }

  viewApplicants() {
    this.closeModal();
    this.router.navigate(['/jobapplicants', this.selectedJob.jobId], {
      state: { job: this.selectedJob },
    });
  }

  toggleStatus(job: any, checked: boolean) {
    console.log('Job', job);
    console.log('checked', checked);
    //this.selectedJob.isActive = !job.isActive;
    this.closeModal();
    this.onToggleStatus.emit(this.selectedJob);
  }
}
