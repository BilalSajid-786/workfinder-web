import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  forgotPasswordForm: FormGroup;
  resetPasswordForm: FormGroup;
  isEmailVerified: boolean = false;
  showPassword: boolean = true;
  /**
   *
   */
  constructor(private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
    
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }

  get newPassword(){
    return this.resetPasswordForm.get('newPassword');
  }

  get confirmPassword(){
    return this.resetPasswordForm.get('confirmPassword');
  }

  onSubmit() {
     if (this.forgotPasswordForm.valid && !this.isEmailVerified){
      const forgotData = this.forgotPasswordForm.value;
      console.log("forgotData", forgotData);
      this.forgotPasswordForm.markAllAsTouched();
      this.isEmailVerified = true;
     }
     else if(this.resetPasswordForm.valid){
      const resetData = this.resetPasswordForm.value;
      console.log("resetData", resetData);
      this.resetPasswordForm.markAllAsTouched();
      this.resetPasswordForm.reset();
      this.router.navigate(['/']);
     }
  }

  goToLogin(){
    this.router.navigate(['/']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
