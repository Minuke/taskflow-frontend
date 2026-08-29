import { Service, inject, signal, computed } from '@angular/core';
import { AuthStore } from '@core/services/auth-store';
import { Category } from '@core/models/category.model';
import { createLoadableState } from '@core/utils/loadable-state.util';

@Service()
export class CategoriesStore {
  private readonly authStore = inject(AuthStore);
  private readonly categories = signal<Category[]>([]);
  private nextId = 1;

  private readonly loadable = createLoadableState(
    'No se han podido cargar las categorías. Inténtalo de nuevo.',
  );
  readonly isLoading = this.loadable.isLoading;
  readonly error = this.loadable.error;

  readonly userCategories = computed(() => {
    const userId = this.authStore.user()?.id;
    if (!userId) {
      return [];
    }
    return this.categories().filter((category) => category.userId === userId);
  });

  load(options?: { forceError?: boolean }): void {
    this.loadable.load(options);
  }

  create(name: string, description: string | null): void {
    const userId = this.authStore.user()?.id;
    if (!userId) {
      throw new Error('NOT_AUTHENTICATED');
    }

    const newCategory: Category = {
      id: this.nextId++,
      name,
      description,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.categories.update((list) => [...list, newCategory]);
  }

  update(id: number, name: string, description: string | null): void {
    this.categories.update((list) =>
      list.map((category) =>
        category.id === id
          ? { ...category, name, description, updatedAt: new Date().toISOString() }
          : category,
      ),
    );
  }

  delete(id: number): void {
    this.categories.update((list) => list.filter((category) => category.id !== id));
  }
}