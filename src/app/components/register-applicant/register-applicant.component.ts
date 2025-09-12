import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

@Component({
  selector: 'app-register-applicant',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, CommonModule],
  templateUrl: './register-applicant.component.html',
  styleUrl: './register-applicant.component.scss',
})
export class RegisterApplicantComponent {
  registrationForm: FormGroup;
  skillsList: Skill[] = []; // not string[]
  selectedSkills: Skill[] = [];

  /**
   *
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private skillService: SkillService
  ) {
    this.registrationForm = this.fb.group({
      fullName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      city: ['', [Validators.required]],
      skills: [[], [Validators.required]],
      qualification: ['', [Validators.required]],
      gender: [
        '',
        [Validators.required, Validators.pattern(/^(male|female)$/i)],
      ],
    });
  }

  get fullName() {
    return this.registrationForm.get('fullName');
  }

  get phoneNumber() {
    return this.registrationForm.get('phoneNumber');
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
  // Mock API
  fakeApiCall(query: string): Observable<Skill[]> {
    const skills: Skill[] = [
      { skillId: 1, skillName: 'Angular' },
      { skillId: 2, skillName: 'C#' },
    ];

    const filtered = skills.filter((s) =>
      s.skillName.toLowerCase().includes(query.toLowerCase())
    );

    return of(filtered); // ✅ wrap in `of` to return Observable<Skill[]>
  }

  onSubmit() {
    console.log(this.registrationForm.value);
    if (this.registrationForm.valid) {
    }
  }
}
