import { Component, inject, input, output, signal, effect } from '@angular/core';
import { form, FormField, required, minLength, maxLength, submit } from '@angular/forms/signals';
import { CategoriesStore } from '@core/services/categories-store';
import { Category } from '@core/models/category.model';

interface CategoryFormModel {
  name: string;
  description: string;
}

@Component({
  selector: 'app-category-form',
  imports: [FormField],
  templateUrl: './category-form.html',
  styleUrl: './category-form.scss',
})
export class CategoryForm {
  private readonly categoriesStore = inject(CategoriesStore);

  readonly category = input<Category | null>(null);
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  protected readonly model = signal<CategoryFormModel>({ name: '', description: '' });

  protected readonly categoryForm = form(this.model, (schema) => {
    required(schema.name, { message: 'El nombre es obligatorio.' });
    minLength(schema.name, 2, { message: 'El nombre debe tener al menos 2 caracteres.' });
    maxLength(schema.name, 40, { message: 'El nombre no puede superar los 40 caracteres.' });
    maxLength(schema.description, 200, { message: 'La descripción no puede superar los 200 caracteres.' });
  });

  constructor() {
    // Sincroniza el modelo del formulario cuando cambia el input `category` (entrar/salir de modo edición).
    effect(() => {
      const current = this.category();
      this.model.set({
        name: current?.name ?? '',
        description: current?.description ?? '',
      });
    });
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.categoryForm, async () => {
      const { name, description } = this.model();
      const trimmedDescription = description.trim();
      const existing = this.category();

      if (existing) {
        this.categoriesStore.update(existing.id, name, trimmedDescription || null);
      } else {
        this.categoriesStore.create(name, trimmedDescription || null);
        this.model.set({ name: '', description: '' });
      }

      this.saved.emit();
    });
  }
}