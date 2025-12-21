import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IndustryService } from '../../services/industry.service';
import { Industry } from '../../models/industry.model';
import { AuthService } from '../../services/auth.service';
import { EmployerService } from '../../services/employer.service';
import { ToastrService } from 'ngx-toastr';
import { Skill } from '../../models/skill.model';
import { SkillService } from '../../services/skill.service';
import { Qualification } from '../../models/qualification.model';
import { QualificationService } from '../../services/qualification.service';
import { ApplicantService } from '../../services/applicant.service';
import { Guid } from '../../models/types.model';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  profileForm!: FormGroup;
  industries: Industry[] = [];
  skillsList: Skill[] = [];
  qualificationList: Qualification[] = [];
  user: any;
  isSubmitted = false;
  userRole: any;
  selectedResume: File[] = [];
  backendResumeName: string | null = null;

  constructor(
    private fb: FormBuilder,
    private skillService: SkillService,
    private industryService: IndustryService,
    private authService: AuthService,
    private employerService: EmployerService,
    private qualificationService: QualificationService,
    private applicantService: ApplicantService,
    private fileService: FileService,
    private toastr: ToastrService
  ) {
    this.getIndustries();
    this.getQualifications();
  }
  ngOnInit(): void {
    this.userRole = this.authService.getRole();

    if (this.userRole == 'Employer') {
      this.getEmployerById();
    }

    if (this.userRole == 'Applicant') {
      this.getApplicantById();
    }

    this.buildForm();
  }

  removeFile(index: number, fileType: string) {
    if (fileType === 'Certificates') {
    }
    if (fileType === 'Resume') {
      this.selectedResume.splice(index, 1);
      console.log(this.selectedResume);
    }
  }

  onFileSelected(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0 && fileType == 'Certificates') {
      // Convert FileList to an array
    }

    if (input.files && input.files.length > 0 && fileType == 'Resume') {
      // Convert FileList to an array
      this.selectedResume = Array.from(input.files);
      console.log('Selected resume:', this.selectedResume);
    }
  }

  buildForm() {
    // Base controls common to all roles
    const controls: any = {
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: [null, Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    };

    // Role-based controls
    if (this.userRole === 'Employer') {
      controls['industryId'] = [''];
      controls['websiteUrl'] = [''];
      controls['companySize'] = [''];
      controls['registrationNumber'] = [''];
    } else if (this.userRole === 'Applicant') {
      controls['gender'] = [
        null,
        [Validators.required, Validators.pattern(/^(male|female)$/i)],
      ];
      controls['skills'] = [[], [Validators.required]];
      controls['qualification'] = ['', [Validators.required]];
    }

    // Build the form
    this.profileForm = this.fb.group(controls);
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

  onSubmit() {
    let obj = { ...this.profileForm.value };
    obj.userId = this.authService.getBaseUserId();
    if (this.authService.getRole() == 'Employer') {
      obj.employerId = this.authService.getUserId();
      this.employerService
        .editEmployer(this.authService.getUserId(), obj)
        .subscribe({
          next: (res) => {
            this.toastr.success('Profile Update Successfully');
            // this.getEmployerById();
          },
          error: (err) => {},
        });
    }
    if (this.authService.getRole() == 'Applicant') {
      obj.applicantId = this.authService.getUserId();
      obj.qualificationId = this.profileForm.get('qualification')?.value;
      obj.resume =
        this.selectedResume.length > 0
          ? this.selectedResume[0].name
          : this.backendResumeName;

      console.log('obj to send is', obj);
      this.applicantService.updateApplicant(obj).subscribe({
        next: (res) => {
          this.toastr.success('Profile Update Successfully');
          this.uploadResume(obj.applicantId);
        },
        error: (err) => {},
      });
    }
  }

  /* ===== Getters ===== */
  get userName() {
    return this.profileForm.get('userName');
  }
  get email() {
    return this.profileForm.get('email');
  }
  get phone() {
    return this.profileForm.get('phone');
  }
  get countryCode() {
    return this.profileForm.get('countryCode');
  }
  get password() {
    return this.profileForm.get('password');
  }
  get confirmPassword() {
    return this.profileForm.get('confirmPassword');
  }
  get city() {
    return this.profileForm.get('city');
  }
  get industryId() {
    return this.profileForm.get('industryId');
  }
  get websiteUrl() {
    return this.profileForm.get('websiteUrl');
  }
  get companySize() {
    return this.profileForm.get('companySize');
  }
  get registrationNumber() {
    return this.profileForm.get('registrationNumber');
  }
  get gender() {
    return this.profileForm.get('gender');
  }
  get skills() {
    return this.profileForm.get('skills');
  }
  get qualification() {
    return this.profileForm.get('qualification');
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

  uploadResume(applicantId: Guid) {
    if (this.selectedResume.length > 0) {
      this.selectedResume.forEach((resume) => {
        this.UploadFile(applicantId, 'Resume', resume);
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

  // Handle "Enter" key for custom skills
  onSkillEnter(event: KeyboardEvent, input: HTMLInputElement) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const name = input.value.trim();
      if (!name) return;

      const control = this.profileForm.get('skills');
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
  selectSkill(skill: Skill, input: HTMLInputElement) {
    const control = this.profileForm.get('skills');
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

  // Called when user types in input
  onSkillInput(event: any) {
    const query = event.target.value;
    this.fetchSkills(query);
  }

  // Remove skill
  removeSkill(index: number) {
    const control = this.profileForm.get('skills');
    const current: Skill[] = control?.value || [];
    current.splice(index, 1);
    control?.setValue([...current]); // update form control
  }

  patchFormValue() {
    if (this.userRole == 'Employer') {
      this.profileForm.patchValue({
        userName: this.user.userName,
        email: this.user.email,
        // Assuming countryCode is included in phone or you have a separate field
        countryCode: '+92', // replace with actual logic if available
        phone: this.user.phone,
        city: this.user.city,
        industryId: this.user.industryId,
        websiteUrl: this.user.websiteUrl,
        companySize: this.user.companySize,
        registrationNumber: this.user.registrationNumber,
      });
    }
    if (this.userRole == 'Applicant') {
      debugger;
      this.profileForm.patchValue({
        userName: this.user.userName,
        email: this.user.email,
        // Assuming countryCode is included in phone or you have a separate field
        countryCode: '+92', // replace with actual logic if available
        phone: this.user.phone,
        city: this.user.city,
        gender: this.user.gender,
      });
      this.profileForm.get('skills')?.setValue(this.user.skills);
      this.profileForm.get('gender')?.setValue('Male');
      this.profileForm
        .get('qualification')
        ?.setValue(this.user.qualificationId);
    }
  }

  getEmployerById() {
    let id = this.authService.getUserId();
    this.employerService.getEmployerById(id).subscribe((res) => {
      this.user = res;
      this.patchFormValue();
    });
  }

  getApplicantById() {
    let id = this.authService.getUserId();
    this.applicantService.getApplicantById().subscribe((res) => {
      this.user = res.result;
      this.backendResumeName = this.user.resume;
      this.patchFormValue();
    });
  }

  removeBackendResume() {
    this.backendResumeName = null;
  }

  getIndustries(): void {
    this.industryService.getIndustries().subscribe((list) => {
      this.industries = list ?? [];
    });
  }
}
