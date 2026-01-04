import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Modal } from 'bootstrap';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { DocumentService } from '../../services/document.service';
import { ChatPannelComponent } from '../chat-pannel/chat-pannel.component';
import { Guid } from '../../models/types.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { AuthService } from '../../services/auth.service';
import { MeetingService } from '../../services/meeting.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-applicant-details',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    ChatPannelComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './applicant-details.component.html',
  styleUrl: './applicant-details.component.scss',
})
export class ApplicantDetailsComponent implements AfterViewInit, OnInit {
  @ViewChild('exampleModal') modalElement!: ElementRef;
  @ViewChild('confirmationModal') confirmationModalElement!: ElementRef;
  modalInstance!: Modal;
  meetingModalInstance!: Modal;
  confirmationModalInstance!: Modal;
  @Input() componentName: string = '';
  @Input() selectedApplicant: any;
  @Output() onChangeStatus = new EventEmitter<any>();
  @Output() onCommunicate = new EventEmitter<any>();
  action: string = '';
  selectedUserId: any = null;
  selectedUserName = '';
  meetingUserId: Guid = '';
  @ViewChild('meetingModal') meetingModal!: ElementRef;
  meetingForm!: FormGroup;

  /**
   *
   */
  constructor(
    private docService: DocumentService,
    private authService: AuthService,
    private meetingService: MeetingService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.meetingForm = this.fb.group({
      meetingName: ['', Validators.required],
      startTime: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngAfterViewInit(): void {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
    this.confirmationModalInstance = new Modal(
      this.confirmationModalElement.nativeElement
    );
    // Initialize Bootstrap modal here
    if (this.meetingModal) {
      this.meetingModalInstance = new Modal(this.meetingModal.nativeElement);
      // 🔹 Listen to 'hidden' event
      this.meetingModal.nativeElement.addEventListener(
        'hidden.bs.modal',
        () => {
          // reopen the main modal when meeting modal closes
          this.modalInstance.show();
        }
      );
    }
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

  onConfirm() {
    this.confirmationModalInstance.hide();
    if (
      this.action == 'Shortlisted' ||
      this.action == 'Reviewed' ||
      this.action == 'Hired' ||
      this.action == 'Rejected'
    ) {
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

  communicationMode(action: string) {
    this.action = action;
    this.closeModal();
    this.selectedApplicant.communicationMode = this.action;
    this.onCommunicate.emit(this.selectedApplicant);
    if (action == 'chat') {
      this.selectedUserId = this.selectedApplicant.applicantId;
      this.selectedUserName = this.selectedApplicant.userName;
    }
    if (action == 'meeting') {
      this.saveMeetingUser(this.selectedApplicant);
    }
  }

  saveMeetingUser(user: any) {
    debugger;
    console.log(user);
    this.meetingUserId = user.applicantId;

    if (this.meetingModalInstance) {
      this.meetingModalInstance.show();
    } else {
      console.error('Modal instance is not initialized');
    }
  }

  downloadResume(user: any) {
    this.docService.downloadResume(user.applicantId, user.resume);
  }
}
