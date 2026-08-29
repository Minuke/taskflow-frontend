import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '@core/services/auth-store';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly isMenuOpen = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected async onLogout(): Promise<void> {
    this.closeMenu();
    this.authStore.logout();
    await this.router.navigate(['/login']);
  }
}