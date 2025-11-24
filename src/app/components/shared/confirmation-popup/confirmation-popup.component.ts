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
  selector: 'app-confirmation-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.scss',
})
export class ConfirmationPopupComponent implements AfterViewInit {
  @Output() onSelection = new EventEmitter<any>();
  @Input() selectedJob: any;
  action: string = '';
  @ViewChild('confirmationModal') confirmationModalElement!: ElementRef;
  confirmationModalInstance!: Modal;

  /**
   *
   */
  constructor() {}

  ngAfterViewInit(): void {
    this.confirmationModalInstance = new Modal(
      this.confirmationModalElement.nativeElement
    );
  }

  openConfirmationModal(data: string, selectedJobId: number) {
    this.action = data;
    this.selectedJob = selectedJobId;
    this.confirmationModalInstance.show();
  }

  onCancel() {
    this.confirmationModalInstance.hide();
    this.onSelection.emit(0);
  }

  onConfirm() {
    this.confirmationModalInstance.hide();
    this.onSelection.emit(this.selectedJob);
  }
}
