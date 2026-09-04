import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PriorityLabelPipe } from '@core/pipes/priority-label.pipe';
import { CategoriesStore } from '@core/services/categories-store';
import { TasksStore } from '@core/services/tasks-store';

const RECENT_LIMIT = 4;

@Component({
  selector: 'app-recent-tasks',
  imports: [RouterLink, PriorityLabelPipe],
  templateUrl: './recent-tasks.html',
  styleUrl: './recent-tasks.scss',
})
export class RecentTasks {
  private readonly tasksStore = inject(TasksStore);
  private readonly categoriesStore = inject(CategoriesStore);

  protected readonly recentTasks = computed(() =>
    [...this.tasksStore.userTasks()]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, RECENT_LIMIT),
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
