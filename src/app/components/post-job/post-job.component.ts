import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillService } from '../../services/skill.service';
import { Skill } from '../../models/skill.model';
import { CommonModule } from '@angular/common';
import { JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { IndustryService } from '../../services/industry.service';
import { Industry } from '../../models/industry.model';
import { ToastrService } from 'ngx-toastr';
import { CountryService } from '../../services/country.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIcon],
  templateUrl: './post-job.component.html',
  styleUrl: './post-job.component.scss',
})
export class PostJobComponent {
  jobSubmissionForm: FormGroup;
  skillsList: Skill[] = []; // not string[]
  jobTypes: string[] = [];
  companyName: string | undefined = 'Company Name';
  industries: Industry[] = [];
  countries: any[] = [];
  dateFocused: boolean = false;

  isEdit = false;
  jobId?: number;

  constructor(
    private fb: FormBuilder,
    private skillService: SkillService,
    private jobService: JobService,
    private authService: AuthService,
    private industryService: IndustryService,
    private toastr: ToastrService,
    private countryService: CountryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.GetJobTypes();
    this.getIndustries();
    this.getCountries();

    this.companyName = authService.getCompanyName();
    if (this.companyName == undefined) {
      this.companyName = 'Company Name';
    }
    this.jobSubmissionForm = this.fb.group({
      jobTitle: ['', [Validators.required]],
      company: [this.companyName, [Validators.required]],
      industryId: [null, [Validators.required]],
      city: ['', [Validators.required]],
      country: [null, [Validators.required]],
      jobType: [null, [Validators.required]],
      expiryDate: ['', [Validators.required]],
      skills: [[], [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  @ViewChild('expiryDate') expiryDateInput!: ElementRef;

  focusInput() {
    this.expiryDateInput.nativeElement.type = 'date';
    this.expiryDateInput.nativeElement.showPicker?.(); // optional for Chrome 108+
    this.expiryDateInput.nativeElement.focus(); // fallback
    this.dateFocused = true;
  }

  ngOnInit(): void {
    // if :id exists => edit mode
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    if (idFromRoute) {
      this.isEdit = true;
      this.jobId = +idFromRoute;
      this.loadJob(this.jobId);
    }
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
        country: values.country,
        jobId: this.jobId
      };

      if (this.isEdit) {
        console.log("EditJob", payload);
        this.jobService.EditJob(payload).subscribe({
          next: (res: any) => {
            console.log('Response', res);
            this.toastr.success(res.message);
            this.router.navigate(['/activejobs']);
          },
          error: (err: any) => {
            this.toastr.error('Edit Job Failed');
          },
        });
      } else {
        this.jobService.PostJob(payload).subscribe({
          next: (res: any) => {
            console.log('Response', res);
            this.toastr.success(res.message);
            this.jobSubmissionForm.reset();
          },
          error: (err: any) => {
            this.toastr.error('Post Job Failed');
          },
        });
      }
      
    } else {
      this.jobSubmissionForm.markAllAsTouched();
    }
  }

  getCountries() {
    this.countryService.getCountries().subscribe((list) => {
      this.countries = list.result ?? [];
      console.log(this.countries);
    });
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

  loadJob(id: number): void {
    this.jobService.getJobById(id).subscribe({
      next: (res) => {
        const job = res.result; 
        console.log("Job", job);
        this.jobSubmissionForm.patchValue({
          jobTitle: job.title,
          company: job.companyName ?? this.companyName,
          industryId: job.industryId,
          city: job.city,
          country: job.country,       // if you store country as name; adjust if object
          jobType: job.jobType,
          expiryDate: job.expiryDate ? job.expiryDate.toString().substring(0,10) : '',
          description: job.description,
        });
        this.jobSubmissionForm.get('skills')?.setValue(job.skills as Skill[]);
        // skills array -> form control (ids)
        // const skillIds = (job.skills ?? []).map((s: any) => s.skillId);
        // this.jobSubmissionForm.get('skills')?.setValue(skillIds);
      },
      error: () => this.toastr.error('Failed to load job')
    });
  }
}
