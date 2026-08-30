import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '@core/services/auth-store';
import { ConfirmDialog } from '@shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink, RouterLinkActive, ConfirmDialog],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation {
  protected readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  protected readonly isMenuOpen = signal(false);
  protected readonly showLogoutConfirm = signal(false);

  protected toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected onLogoutRequested(): void {
    this.closeMenu();
    this.showLogoutConfirm.set(true);
  }

  protected onLogoutCancelled(): void {
    this.showLogoutConfirm.set(false);
  }

  protected async onLogoutConfirmed(): Promise<void> {
    this.showLogoutConfirm.set(false);
    this.authStore.logout();
    await this.router.navigate(['/login']);
  }
}