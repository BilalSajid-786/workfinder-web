import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import bootstrap from 'bootstrap';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss'],
})
export class JobDetailsComponent implements AfterViewInit {
  @Input() selectedJob: any;
  @Input() componentName: string = ''; // identifies where it's used: AppliedJobs / SavedJobs etc.
  @Output() onSave = new EventEmitter<any>();
  @Output() onApply = new EventEmitter<any>();

  @ViewChild('exampleModal') modalElement!: ElementRef;
  private modalInstance: any;

  ngAfterViewInit() {
    this.modalInstance = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  openModal() {
    this.modalInstance.show();
  }

  closeModal() {
    this.modalInstance.hide();
  }

  saveJob() {
    this.onSave.emit(this.selectedJob);
    this.closeModal();
  }

  applyJob() {
    this.onApply.emit(this.selectedJob);
    this.closeModal();
  }
}
