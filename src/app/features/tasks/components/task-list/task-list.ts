import { Component, inject, signal } from '@angular/core';
import { TasksStore } from '@core/services/tasks-store';
import { CategoriesStore } from '@core/services/categories-store';
import { TaskForm } from '@features/tasks/components/task-form/task-form';

@Component({
  selector: 'app-task-list',
  imports: [TaskForm],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  protected readonly tasksStore = inject(TasksStore);
  private readonly categoriesStore = inject(CategoriesStore);

  protected readonly editingId = signal<number | null>(null);

  protected categoryNameFor(categoryId: number | null): string {
    if (!categoryId) {
      return 'Sin categoría';
    }
    return this.categoriesStore.userCategories().find((c) => c.id === categoryId)?.name ?? 'Sin categoría';
  }

  protected onEdit(taskId: number): void {
    this.editingId.set(taskId);
  }

  protected onEditCancelled(): void {
    this.editingId.set(null);
  }

  protected onEditSaved(): void {
    this.editingId.set(null);
  }
}