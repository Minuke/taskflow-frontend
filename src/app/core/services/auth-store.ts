import { Service, signal, computed } from '@angular/core';
import { User } from '@core/models/user.model';

interface StoredUser extends User {
  password: string; // Solo en memoria. En B3 esto lo gestionará el backend con hash (bcrypt), nunca en plano.
}

@Service()
export class AuthStore {
  private readonly users = signal<StoredUser[]>([
  {
    id: 1,
    name: 'Admin',
    email: 'admin@taskflow.dev',
    password: 'Admin1234',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]);
  private readonly currentUser = signal<User | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  register(name: string, email: string, password: string): void {
    const normalizedEmail = email.trim().toLowerCase();

    if (this.users().some((u) => u.email === normalizedEmail)) {
      throw new Error('EMAIL_ALREADY_REGISTERED');
    }

    const newUser: StoredUser = {
      id: this.users().length + 1,
      name,
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.update((list) => [...list, newUser]);
    this.setCurrentUser(newUser);
  }

  login(email: string, password: string): void {
    const normalizedEmail = email.trim().toLowerCase();
    const found = this.users().find(
      (u) => u.email === normalizedEmail && u.password === password,
    );

    if (!found) {
      throw new Error('INVALID_CREDENTIALS');
    }

    this.setCurrentUser(found);
  }

  logout(): void {
    this.currentUser.set(null);
  }

  private setCurrentUser(user: StoredUser): void {
    const { password, ...publicUser } = user;
    this.currentUser.set(publicUser);
  }
}