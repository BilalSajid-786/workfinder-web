import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkillService } from '../../services/skill.service';
import { Skill } from '../../models/skill.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post-job.component.html',
  styleUrl: './post-job.component.scss',
})
export class PostJobComponent {
  jobSubmissionForm: FormGroup;
  skillsList: Skill[] = []; // not string[]

  constructor(private fb: FormBuilder, private skillService: SkillService) {
    this.jobSubmissionForm = this.fb.group({
      skills: [[], [Validators.required]],
    });
  }

  get skills() {
    return this.jobSubmissionForm.get('skills');
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
