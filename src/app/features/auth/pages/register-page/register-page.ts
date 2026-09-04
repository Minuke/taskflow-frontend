import { Component } from '@angular/core';
import { RegisterForm } from '@features/auth/components/register-form/register-form';

@Component({
  imports: [RegisterForm],
  selector: 'app-register-page',
  styleUrl: './register-page.scss',
  templateUrl: './register-page.html',
})
export class RegisterPage {}
