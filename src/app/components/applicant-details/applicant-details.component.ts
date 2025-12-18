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
  selector: 'app-applicant-details',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule],
  templateUrl: './applicant-details.component.html',
  styleUrl: './applicant-details.component.scss',
})
export class ApplicantDetailsComponent implements AfterViewInit {
  @ViewChild('exampleModal') modalElement!: ElementRef;
  @ViewChild('confirmationModal') confirmationModalElement!: ElementRef;
  modalInstance!: Modal;
  confirmationModalInstance!: Modal;
  @Input() componentName: string = '';
  @Input() selectedApplicant: any;
  @Output() onChangeStatus = new EventEmitter<any>();
  @Output() onCommunicate = new EventEmitter<any>();
  action: string = '';

  ngAfterViewInit(): void {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
    this.confirmationModalInstance = new Modal(
      this.confirmationModalElement.nativeElement
    );
    console.log('SelectedApplicant', this.selectedApplicant);
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
    if (this.action == 'Shortlisted' || this.action == 'Reviewed' || this.action == 'Hired' || this.action == 'Rejected') {
      this.selectedApplicant.applicantStatus = this.action;
      this.onChangeStatus.emit(this.selectedApplicant);
    }
    // if (this.action == 'save') this.onSave.emit(this.selectedJob);
  }

  onCancel() {
    this.confirmationModalInstance.hide();
    this.openModal();
  }

  onImgError(ev: Event) {
    const img = ev.target as HTMLImageElement;
    img.src = 'assets/user-placeholder.svg';
  }

  updateApplicantStatus(status: string) {
    this.action = status;
    this.closeModal();
    this.openConfirmationModal();
    // this.onApply.emit(this.selectedJob);
    // this.closeModal();
  }

  communicationMode(action: string){
    this.action = action;
    this.closeModal();
    this.selectedApplicant.communicationMode = this.action;
    this.onCommunicate.emit(this.selectedApplicant);

  }
}
