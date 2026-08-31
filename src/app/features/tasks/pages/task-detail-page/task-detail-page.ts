import { Component, inject, input, computed } from '@angular/core';
import { Location } from '@angular/common';
import { TasksStore } from '@core/services/tasks-store';
import { CategoriesStore } from '@core/services/categories-store';
import { PriorityLabelPipe } from '@core/pipes/priority-label.pipe';
import { FriendlyDatePipe } from '@core/pipes/friendly-date.pipe';
import { Priority } from '@core/models/priority.enum';

@Component({
  selector: 'app-task-detail-page',
  imports: [PriorityLabelPipe, FriendlyDatePipe],
  templateUrl: './task-detail-page.html',
  styleUrl: './task-detail-page.scss',
})
export class TaskDetailPage {
  readonly id = input.required<string>();

  private readonly location = inject(Location);
  private readonly tasksStore = inject(TasksStore);
  private readonly categoriesStore = inject(CategoriesStore);

  protected readonly Priority = Priority;

  protected readonly task = computed(() => this.tasksStore.taskById(Number(this.id())));

  protected readonly categoryName = computed(() => {
    const categoryId = this.task()?.categoryId ?? null;
    if (!categoryId) {
      return 'Sin categoría';
    }
    return (
      this.categoriesStore.userCategories().find((c) => c.id === categoryId)?.name ??
      'Sin categoría'
    );
  });

  protected goBack(): void {
    this.location.back();
  }
}