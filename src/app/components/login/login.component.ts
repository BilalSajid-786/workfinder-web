import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/login-request.model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = true;

  /**
   *
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData: LoginRequest = this.loginForm.value;
      this.authService.login(loginData).subscribe({
        next: (res) => {
          this.toastr.success('Login Successfull');
          // --- returnUrl handling (added) ---
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
            return; // stop here; don't run role fallbacks
          }
          // -----------------------------------
          if (this.authService.getRole() == 'Admin') {
            this.router.navigate(['dashboard']);
          } else if (this.authService.getRole() == 'Employer') {
            this.router.navigate(['activejobs']);
          } else if (this.authService.getRole() == 'Applicant') {
            this.router.navigate(['availablejobs']);
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.toastr.error('Login Failed');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  goForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
