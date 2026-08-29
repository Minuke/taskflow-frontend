import { Component, inject, signal } from '@angular/core';
import { CategoriesStore } from '@core/services/categories-store';
import { TasksStore } from '@core/services/tasks-store';
import { Category } from '@core/models/category.model';
import { CategoryForm } from '@features/categories/components/category-form/category-form';
import { ConfirmDialog } from '@shared/components/confirm-dialog/confirm-dialog';
import { SkeletonList } from '@shared/components/skeleton-list/skeleton-list';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-list',
  imports: [RouterLink, CategoryForm, ConfirmDialog, SkeletonList],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList {
  protected readonly categoriesStore = inject(CategoriesStore);
  protected readonly tasksStore = inject(TasksStore);

  protected readonly editingId = signal<number | null>(null);
  protected readonly deletingCategory = signal<Category | null>(null);

  constructor() {
    this.categoriesStore.load();
  }

  protected onRetry(): void {
    this.categoriesStore.load();
  }

  protected taskCountFor(categoryId: number): number {
    return this.tasksStore.userTasks().filter((task) => task.categoryId === categoryId).length;
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