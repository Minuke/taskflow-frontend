import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  form,
  FormField,
  required,
  email as emailValidator,
  minLength,
  validate,
  submit,
} from '@angular/forms/signals';
import { AuthStore } from '@core/services/auth-store';

interface RegisterFormModel {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-register-form',
  imports: [FormField, RouterLink],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly errorMessage = signal<string | null>(null);

  protected readonly model = signal<RegisterFormModel>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  protected readonly registerForm = form(this.model, (schema) => {
    required(schema.name, { message: 'El nombre es obligatorio.' });
    minLength(schema.name, 2, { message: 'El nombre debe tener al menos 2 caracteres.' });

    required(schema.email, { message: 'El email es obligatorio.' });
    emailValidator(schema.email, { message: 'Introduce un email válido.' });

    required(schema.password, { message: 'La contraseña es obligatoria.' });
    minLength(schema.password, 8, { message: 'La contraseña debe tener al menos 8 caracteres.' });

    required(schema.confirmPassword, { message: 'Confirma la contraseña.' });
    validate(schema.confirmPassword, ({ value, valueOf, stateOf }) => {
      if (!stateOf(schema.password).touched()) {
        return null;
      }
      if (value() !== valueOf(schema.password)) {
        return { kind: 'passwordMismatch', message: 'Las contraseñas no coinciden.' };
      }
      return null;
    });
  });

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.errorMessage.set(null);

    await submit(this.registerForm, async () => {
      const { name, email, password } = this.model();

      try {
        this.authStore.register(name, email, password);
        await this.router.navigate(['/dashboard']);
      } catch {
        this.errorMessage.set('Ese email ya está registrado.');
      }
    });
  }
}