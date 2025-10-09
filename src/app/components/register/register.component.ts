import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent{

  selectedRole: string | undefined;

  /**
   *
   */
  constructor(private router: Router) {
    this.selectedRole = 'register-applicant';
  }

  // ngOnInit(): void {
    
  // }

  onRoleChange(role: string): void {
    this.selectedRole = role;
  }

  onSubmit(){
    this.router.navigate([`/${this.selectedRole}`]);
  }

}
