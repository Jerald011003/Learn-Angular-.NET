import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    onGoogleLoginSuccess: (response: any) => void;
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.onGoogleLoginSuccess = this.onGoogleLoginSuccess.bind(this);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onGoogleLoginSuccess(response: any): void {
    const token = response.credential; 
    localStorage.setItem('googleToken', token); 
    this.router.navigate(['/dashboard']);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
    }
  }
}
