import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthStore } from '@core/services/auth-store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected async onLogout(): Promise<void> {
    this.authStore.logout();
    await this.router.navigate(['/login']);
  }
}