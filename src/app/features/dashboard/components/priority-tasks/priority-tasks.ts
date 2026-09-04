import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Priority } from '@core/models/priority.enum';
import { PriorityLabelPipe } from '@core/pipes/priority-label.pipe';
import { CategoriesStore } from '@core/services/categories-store';
import { TasksStore } from '@core/services/tasks-store';

const PRIORITY_TASKS_LIMIT = 4;

@Component({
  selector: 'app-priority-tasks',
  imports: [RouterLink, PriorityLabelPipe],
  templateUrl: './priority-tasks.html',
  styleUrl: './priority-tasks.scss',
})
export class PriorityTasks {
  private readonly tasksStore = inject(TasksStore);
  private readonly categoriesStore = inject(CategoriesStore);

  protected readonly priorityTasks = computed(() =>
    this.tasksStore
      .userTasks()
      .filter((task) => task.priority === Priority.High && !task.completed)
      .slice(0, PRIORITY_TASKS_LIMIT),
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
