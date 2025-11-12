import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, debounceTime, of, switchMap } from 'rxjs';
import { SkillService } from '../../services/skill.service';
import { Skill } from '../../models/skill.model';
import { Applicant } from '../../models/applicant.model';
import { ApplicantService } from '../../services/applicant.service';
import { FileService } from '../../services/file.service';
import { Guid } from '../../models/types.model';
import { QualificationService } from '../../services/qualification.service';
import { Qualification } from '../../models/qualification.model';

@Component({
  selector: 'app-register-applicant',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, CommonModule],
  templateUrl: './register-applicant.component.html',
  styleUrl: './register-applicant.component.scss',
})
export class RegisterApplicantComponent implements OnInit {
  registrationForm: FormGroup;
  skillsList: Skill[] = []; // not string[]
  qualificationList: Qualification[] = [];
  selectedSkills: Skill[] = [];
  isSubmitted = false;
  selectedCertificates: File[] = [];
  selectedResume: File[] = [];
  showPassword: boolean = true;

  /**
   *
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private skillService: SkillService,
    private applicantService: ApplicantService,
    private fileService: FileService,
    private qualificationService: QualificationService
  ) {
    this.registrationForm = this.fb.group({
      fullName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      countryCode: [null, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      country: [null, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      city: ['', [Validators.required]],
      skills: [[], [Validators.required]],
      qualification: [null, [Validators.required]],
      gender: [
        null,
        [Validators.required, Validators.pattern(/^(male|female)$/i)],
      ],
      terms: [false, [Validators.required]],
    });
  }

  get fullName() {
    return this.registrationForm.get('fullName');
  }

  get phone() {
    return this.registrationForm.get('phone');
  }

  get countryCode() {
    return this.registrationForm.get('countryCode');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get country() {
    return this.registrationForm.get('country');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  get city() {
    return this.registrationForm.get('city');
  }

  get skills() {
    return this.registrationForm.get('skills');
  }

  get gender() {
    return this.registrationForm.get('gender');
  }

  get qualification() {
    return this.registrationForm.get('qualification');
  }
  get terms() {
    return this.registrationForm.get('terms');
  }

  ngOnInit(): void {
    this.getQualifications();
  }

  getQualifications() {
    this.qualificationService.getQualifications().subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // res.result should be Skill[]
          this.qualificationList = res.result;
        } else {
          this.qualificationList = [];
        }
      },
      error: (err) => {
        console.error('Error fetching skills:', err);
        this.qualificationList = [];
      },
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // Add skill from dropdown OR free text
  selectSkill(skill: Skill, input: HTMLInputElement) {
    const control = this.registrationForm.get('skills');
    const current: Skill[] = control?.value || [];

    // prevent duplicates
    if (
      !current.find(
        (s) => s.skillName.toLowerCase() === skill.skillName.toLowerCase()
      )
    ) {
      control?.setValue([...current, skill]);
    }

    input.value = ''; // clear input
    this.skillsList = []; // hide dropdown
  }

  onFileSelected(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0 && fileType == 'Certificates') {
      // Convert FileList to an array
      this.selectedCertificates = Array.from(input.files);
      console.log('Selected certificates:', this.selectedCertificates);
    }

    if (input.files && input.files.length > 0 && fileType == 'Resume') {
      // Convert FileList to an array
      this.selectedResume = Array.from(input.files);
      console.log('Selected resume:', this.selectedResume);
    }
  }

  // Handle "Enter" key for custom skills
  onSkillEnter(event: KeyboardEvent, input: HTMLInputElement) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const name = input.value.trim();
      if (!name) return;

      const control = this.registrationForm.get('skills');
      const current: Skill[] = control?.value || [];

      // Already selected?
      if (
        current.find((s) => s.skillName.toLowerCase() === name.toLowerCase())
      ) {
        input.value = '';
        this.skillsList = [];
        return;
      }

      // Check if it exists in skillsList (API result)
      const existing = this.skillsList.find(
        (s) => s.skillName.toLowerCase() === name.toLowerCase()
      );

      if (existing) {
        // Add from API list
        control?.setValue([...current, existing]);
      } else {
        // Add new skillId=0
        const newSkill: Skill = { skillId: 0, skillName: name };
        control?.setValue([...current, newSkill]);
      }

      input.value = '';
      this.skillsList = [];
    }
  }

  // Called when user types in input
  onSkillInput(event: any) {
    const query = event.target.value;
    this.fetchSkills(query);
    // this.fakeApiCall(query).subscribe((res: Skill[]) => {
    //   const currentSkills = this.selectedSkills.map((s) => s.skillName);
    //   this.skillsList = res.filter((s) => !currentSkills.includes(s.skillName));
    // });
  }

  // Remove skill
  removeSkill(index: number) {
    const control = this.registrationForm.get('skills');
    const current: Skill[] = control?.value || [];
    current.splice(index, 1);
    control?.setValue([...current]); // update form control
  }

  removeFile(index: number, fileType: string) {
    if (fileType === 'Certificates') {
      this.selectedCertificates.splice(index, 1);
      console.log(this.selectedCertificates);
    }
    if (fileType === 'Resume') {
      this.selectedResume.splice(index, 1);
      console.log(this.selectedResume);
    }
  }

  fetchSkills(query: string): void {
    this.skillService.getSkillByName(query).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // res.result should be Skill[]
          this.skillsList = res.result;
        } else {
          this.skillsList = [];
        }
      },
      error: (err) => {
        console.error('Error fetching skills:', err);
        this.skillsList = [];
      },
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    debugger;
    if (this.registrationForm.valid) {
      const values = this.registrationForm.getRawValue();
      const payload: Applicant = {
        name: values.fullName?.trim(),
        email: values.email?.trim(),
        password: values.password, // backend should hash
        city: values.city?.trim(),
        country: values.country?.trim(),
        phone: values.countryCode?.trim() + values.phone?.trim(),
        gender: values.gender?.trim(),
        qualificationId: values.qualification?.trim(),
        skills: values.skills,
      } as unknown as Applicant;

      this.applicantService.registerApplicantData(payload).subscribe({
        next: (res: any) => {
          console.log('Response', res);
          this.toastr.success(res.message);
          const applicantId: Guid = res.result.applicantId;
          debugger;
          this.uploadResume(applicantId);
          this.uploadCertificates(applicantId);
          this.registrationForm.markAllAsTouched();
          this.router.navigate(['']);
        },
        error: (err: any) => {
          this.toastr.error('Applicant registration Failed');
        },
      });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  uploadResume(applicantId: Guid) {
    if (this.selectedResume.length > 0) {
      this.selectedResume.forEach((resume) => {
        this.UploadFile(applicantId, 'Resume', resume);
      });
    }
  }

  uploadCertificates(applicantId: Guid) {
    if (this.selectedCertificates.length > 0) {
      this.selectedCertificates.forEach((certificate) => {
        this.UploadFile(applicantId, 'Certificate', certificate);
      });
    }
  }

  UploadFile(applicantId: Guid, fileType: string, file: File) {
    debugger;
    const formData = new FormData();
    formData.append('formFile', file, file.name);
    this.fileService.UploadFile(formData, fileType, applicantId).subscribe({
      next: (res: any) => {
        console.log('Response', res);
      },
      error: (err: any) => {},
    });
  }
}
