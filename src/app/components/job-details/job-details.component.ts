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

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule],
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
  action: string = '';

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
}
