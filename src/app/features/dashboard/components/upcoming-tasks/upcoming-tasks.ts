import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TasksStore } from '@core/services/tasks-store';
import { CategoriesStore } from '@core/services/categories-store';
import { PriorityLabelPipe } from '@core/pipes/priority-label.pipe';
import { FriendlyDatePipe } from '@core/pipes/friendly-date.pipe';

const UPCOMING_LIMIT = 4;

@Component({
  selector: 'app-upcoming-tasks',
  imports: [RouterLink, PriorityLabelPipe, FriendlyDatePipe],
  templateUrl: './upcoming-tasks.html',
  styleUrl: './upcoming-tasks.scss',
})
export class UpcomingTasks {
  private readonly tasksStore = inject(TasksStore);
  private readonly categoriesStore = inject(CategoriesStore);

  protected readonly upcomingTasks = computed(() =>
    this.tasksStore
      .userTasks()
      .filter((task) => !task.completed && task.dueDate !== null)
      .sort((a, b) => (a.dueDate as string).localeCompare(b.dueDate as string))
      .slice(0, UPCOMING_LIMIT),
  );

  protected categoryNameFor(categoryId: number | null): string {
    if (!categoryId) {
      return 'Sin categoría';
    }
    return (
      this.categoriesStore.userCategories().find((c) => c.id === categoryId)?.name ??
      'Sin categoría'
    );
  }
}