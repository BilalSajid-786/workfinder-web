import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl} from '@angular/forms';
import { EmployerService } from '../../services/employer.service';
import { Employer } from '../../models/employer.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Industry } from '../../models/industry.model';
import { IndustryService } from '../../services/industry.service';

@Component({
  selector: 'app-register-employer',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, CommonModule],
  templateUrl: './register-employer.component.html',
  styleUrl: './register-employer.component.scss',
})
export class RegisterEmployerComponent implements OnInit {
  employerForm!: FormGroup;
  submitted = false;
  industries: Industry[] = [];

  /**
   *
   */
  constructor(
    private fb: FormBuilder,
    private employerSrvice: EmployerService,
    private router: Router,
    private toastr: ToastrService,
    private industryService: IndustryService
  ) {}
  ngOnInit(): void {
    this.buildForm();
    this.getIndustries(); 
  }

  private buildForm(): void {
    this.employerForm = this.fb.group({
      companyName: this.fb.control('', { validators: [Validators.required] }),
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
      }),
      password: this.fb.control('', {
        validators: [Validators.required, Validators.minLength(8)],
      }),
      city: this.fb.control('', { validators: [Validators.required] }),
      industryId: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      websiteUrl: new FormControl<string | null>(null),
      companySize: this.fb.control('', { validators: [Validators.required] }),
      phoneNumber: this.fb.control('', { validators: [Validators.required] }),
      contactPerson: this.fb.control('', { validators: [Validators.required] }),
      registrationNumber: new FormControl<string | null>(null),
      terms: this.fb.control(false, { validators: [Validators.requiredTrue] }),
    });
  }

  get companyName() {
    return this.employerForm.get('companyName');
  }
  get email() {
    return this.employerForm.get('email');
  }
  get password() {
    return this.employerForm.get('password');
  }
  get city() {
    return this.employerForm.get('city');
  }
  get industryId() {
    return this.employerForm.get('industryId');
  }
  get websiteUrl() {
    return this.employerForm.get('websiteUrl');
  }
  get companySize() {
    return this.employerForm.get('companySize');
  }
  get phoneNumber() {
    return this.employerForm.get('phoneNumber');
  }
  get contactPerson() {
    return this.employerForm.get('contactPerson');
  }
  get registrationNumber() {
    return this.employerForm.get('registrationNumber');
  }
  get terms() {
    return this.employerForm.get('terms');
  }

  onSubmit() {
    if (this.employerForm.valid) {
      this.submitted = true;
      const values = this.employerForm.getRawValue();
      console.log('Values', values);

      const payload: Employer = {
        // if your Employer model includes only employer fields, remove user props accordingly
        companyName: values.companyName?.trim(),
        websiteUrl: values.websiteUrl?.trim() || null,
        industryId: values.industryId,
        companySize: values.companySize?.trim(),
        contactPerson: values.contactPerson?.trim(),
        registrationNumber: values.registrationNumber?.trim() || null,

        // If your Employer model or API expects these too, keep them; otherwise move them to a User DTO
        name: values.companyName?.trim(),
        email: values.email?.trim(),
        password: values.password, // backend should hash
        city: values.city?.trim(),
        country: 'Germany',
        phone: values.phoneNumber?.trim(),
        roleId: '0A4B5DAA-8E42-46F1-B7AB-304806C6B996',
        userId: null,
      } as unknown as Employer;

      console.log('EmployerData', payload);
      this.employerSrvice.registerEmployer(payload).subscribe({
        next: (res) => {
          console.log('Response', res);
          if (res.userId!= null && res.employerId!= null) {
            this.toastr.success('Employer registered successfully');
            this.employerForm.markAllAsTouched();
            this.router.navigate(['']);
          }
        },
        error: (err) => {
          console.error('Employer registration failed:', err);
          this.toastr.error('Employer registration Failed');
        },
      });
    } else {
      this.employerForm.markAllAsTouched();
    }
  }

  getIndustries(): void{
    this.industryService.getIndustries().subscribe((list) => {
      this.industries = list ?? [];
    });
  }
}


// v: any = this.employerForm.getRawValue();
// // map v to your API model(s)
// payload: any = {
//   companyName: this.v.companyName.trim(),
//   email: this.v.email.trim(),
//   password: this.v.password.trim(),
//   city: this.v.city.trim(),
//   industryId: this.v.industryId,
//   websiteUrl: this.v.websiteUrl?.trim() || null,
//   companySize: this.v.companySize.trim(),
//   phoneNumber: this.v.phoneNumber.trim(),
//   contactPerson: this.v.contactPerson.trim(),
//   registrationNumber: this.v.registrationNumber?.trim() || null,
//   terms: this.v.terms
// };

// const values = this.employerForm.getRawValue();
    // console.log("Values", values);

    // const payload: Employer = {
    //   // if your Employer model includes only employer fields, remove user props accordingly
    //   companyName: values.companyName?.trim(),
    //   websiteUrl: values.websiteUrl?.trim() || null,
    //   industryId: values.industryId,
    //   companySize: values.companySize?.trim(),
    //   contactPerson: values.contactPerson?.trim(),
    //   registrationNumber: values.registrationNumber?.trim() || null,

    //   // If your Employer model or API expects these too, keep them; otherwise move them to a User DTO
    //   email: values.email?.trim(),
    //   password: values.password,            // backend should hash
    //   city: values.city?.trim(),
    //   phoneNumber: values.phoneNumber?.trim(),
    // } as unknown as Employer;
