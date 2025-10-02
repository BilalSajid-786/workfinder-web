import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SkillService } from '../../services/skill.service';
import { Skill } from '../../models/skill.model';
import { CommonModule } from '@angular/common';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { IndustryService } from '../../services/industry.service';
import { Industry } from '../../models/industry.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-job.component.html',
  styleUrl: './post-job.component.scss',
})
export class PostJobComponent {
  jobSubmissionForm: FormGroup;
  skillsList: Skill[] = []; // not string[]
  jobTypes: string[] = [];
  companyName: string | undefined = 'Company Name';
  industries: Industry[] = [];

  constructor(
    private fb: FormBuilder,
    private skillService: SkillService,
    private jobService: JobService,
    private authService: AuthService,
    private industryService: IndustryService,
    private toastr: ToastrService
  ) {
    this.GetJobTypes();
    this.getIndustries();
    this.companyName = authService.getCompanyName();
    if (this.companyName == undefined) {
      this.companyName = 'Company Name';
    }
    this.jobSubmissionForm = this.fb.group({
      jobTitle: ['', [Validators.required]],
      company: [this.companyName, [Validators.required]],
      industryId: [null, [Validators.required]],
      city: ['', [Validators.required]],
      jobType: [null, [Validators.required]],
      expiryDate: ['', [Validators.required]],
      skills: [[], [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  get jobTitle() {
    return this.jobSubmissionForm.get('jobTitle');
  }
  get company() {
    return this.jobSubmissionForm.get('company');
  }
  get industryId() {
    return this.jobSubmissionForm.get('industryId');
  }
  get city() {
    return this.jobSubmissionForm.get('city');
  }
  get jobType() {
    return this.jobSubmissionForm.get('jobType');
  }
  get expiryDate() {
    return this.jobSubmissionForm.get('expiryDate');
  }
  get skills() {
    return this.jobSubmissionForm.get('skills');
  }
  get description() {
    return this.jobSubmissionForm.get('description');
  }

  onSubmit() {
    if (this.jobSubmissionForm.valid) {
      const values = this.jobSubmissionForm.getRawValue();
      const payload: any = {
        title: values.jobTitle?.trim(),
        description: values.description?.trim(),
        jobType: values.jobType?.trim(),
        city: values.city?.trim(),
        skills: values.skills,
        expiryDate: values.expiryDate,
        industryId: values.industryId,
        employerId: this.authService.getEmployerId(),
      };

      this.jobService.PostJob(payload).subscribe({
        next: (res: any) => {
          console.log('Response', res);
          this.toastr.success(res.message);
        },
        error: (err: any) => {
          this.toastr.error('Applicant registration Failed');
        },
      });
    } else {
      this.jobSubmissionForm.markAllAsTouched();
    }
  }
  getIndustries(): void {
    this.industryService.getIndustries().subscribe((list) => {
      this.industries = list ?? [];
    });
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

  // Add skill from dropdown OR free text
  selectSkill(skill: Skill, input: HTMLInputElement) {
    const control = this.jobSubmissionForm.get('skills');
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

  // Handle "Enter" key for custom skills
  onSkillEnter(event: KeyboardEvent, input: HTMLInputElement) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const name = input.value.trim();
      if (!name) return;

      const control = this.jobSubmissionForm.get('skills');
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

  // Remove skill
  removeSkill(index: number) {
    const control = this.jobSubmissionForm.get('skills');
    const current: Skill[] = control?.value || [];
    current.splice(index, 1);
    control?.setValue([...current]); // update form control
  }
}
