import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  resetPasswordForm: FormGroup;
  isTokenReceived: boolean = false;
  token: any = null;
  showPassword: boolean = true;
  /**
   *
   */
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (this.token != null) this.isTokenReceived = true;
    console.log('Token:', this.token);
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  get newPassword() {
    return this.resetPasswordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid && !this.isTokenReceived) {
      const forgotData = this.forgotPasswordForm.value;
      console.log('forgotData', forgotData);
      this.forgotPasswordForm.markAllAsTouched();
      this.forgotPassword(this.forgotPasswordForm.value);
      this.router.navigate(['/']);
    } else if (this.resetPasswordForm.valid) {
      const resetData = this.resetPasswordForm.value;
      console.log('resetData', resetData);
      this.resetPassword({
        password: this.resetPasswordForm.value.newPassword,
        token: this.token,
      });
      this.resetPasswordForm.markAllAsTouched();
      this.resetPasswordForm.reset();
      this.router.navigate(['/']);
    }
  }

  forgotPassword(forgotPasswordModel: any) {
    this.authService.forgotPassword(forgotPasswordModel).subscribe({
      next: (res) => {
        this.toastr.success('Reset Link sent successfully');
      },
      error: (err) => {
        this.toastr.error('Reset Link Failed. Please try later.');
      },
    });
  }

  resetPassword(resetPasswordModel: any) {
    this.authService.resetPassword(resetPasswordModel).subscribe({
      next: (res) => {
        this.toastr.success('Password reset successfully');
      },
      error: (err) => {
        this.toastr.error('Password reset failed. Please try later.');
      },
    });
  }

  goToLogin() {
    this.router.navigate(['/']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
