import { Component, inject, signal } from '@angular/core';
import { email as emailValidator, FormField, form, required, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '@core/services/auth-store';

interface LoginFormModel {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  imports: [FormField, RouterLink],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly errorMessage = signal<string | null>(null);

  protected readonly model = signal<LoginFormModel>({
    email: '',
    password: '',
  });

  protected readonly loginForm = form(this.model, (schema) => {
    required(schema.email, { message: 'El email es obligatorio.' });
    emailValidator(schema.email, { message: 'Introduce un email válido.' });
    required(schema.password, { message: 'La contraseña es obligatoria.' });
  });

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set(null);

    await submit(this.loginForm, async () => {
      const { email, password } = this.model();

      try {
        this.authStore.login(email, password);
        await this.router.navigate(['/dashboard']);
      } catch {
        this.errorMessage.set('Email o contraseña incorrectos.');
      }
    });
  }
}
