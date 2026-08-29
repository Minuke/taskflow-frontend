import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TasksStore } from '@core/services/tasks-store';
import { CategoriesStore } from '@core/services/categories-store';

@Component({
  selector: 'app-task-detail-page',
  imports: [RouterLink],
  templateUrl: './task-detail-page.html',
  styleUrl: './task-detail-page.scss',
})
export class TaskDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly tasksStore = inject(TasksStore);
  private readonly categoriesStore = inject(CategoriesStore);

  private readonly paramMap = toSignal(this.route.paramMap);
  private readonly taskId = computed(() => Number(this.paramMap()?.get('id')));

  protected readonly task = computed(() => this.tasksStore.taskById(this.taskId()));

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
}