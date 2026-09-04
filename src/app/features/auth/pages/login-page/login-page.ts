import { Component } from '@angular/core';
import { LoginForm } from '@features/auth/components/login-form/login-form';

@Component({
  imports: [LoginForm],
  selector: 'app-login-page',
  styleUrl: './login-page.scss',
  templateUrl: './login-page.html',
})
export class LoginPage {}
