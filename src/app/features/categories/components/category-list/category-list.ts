import { Component, inject, signal } from '@angular/core';
import { CategoriesStore } from '@core/services/categories-store';
import { Category } from '@core/models/category.model';
import { CategoryForm } from '@features/categories/components/category-form/category-form';
import { ConfirmDialog } from '@shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-category-list',
  imports: [CategoryForm, ConfirmDialog],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList {
  protected readonly categoriesStore = inject(CategoriesStore);

  protected readonly editingId = signal<number | null>(null);
  protected readonly deletingCategory = signal<Category | null>(null);

  // Placeholder: el conteo real se conecta a TasksStore en A4, cuando exista.
  protected taskCountFor(categoryId: number): number {
    return 0;
  }

  protected onEdit(categoryId: number): void {
    this.editingId.set(categoryId);
  }

  protected onEditCancelled(): void {
    this.editingId.set(null);
  }

  protected onEditSaved(): void {
    this.editingId.set(null);
  }

  protected onDeleteRequested(category: Category): void {
    this.deletingCategory.set(category);
  }

  protected onDeleteCancelled(): void {
    this.deletingCategory.set(null);
  }

  protected onDeleteConfirmed(categoryId: number): void {
    this.categoriesStore.delete(categoryId);
    this.deletingCategory.set(null);
  }
}