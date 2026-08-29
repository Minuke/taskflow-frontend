import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CategoriesStore } from '@core/services/categories-store';
import { TasksStore } from '@core/services/tasks-store';

@Component({
  selector: 'app-category-detail-page',
  imports: [RouterLink],
  templateUrl: './category-detail-page.html',
  styleUrl: './category-detail-page.scss',
})
export class CategoryDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly categoriesStore = inject(CategoriesStore);
  private readonly tasksStore = inject(TasksStore);

  private readonly paramMap = toSignal(this.route.paramMap);
  private readonly categoryId = computed(() => Number(this.paramMap()?.get('id')));

  protected readonly category = computed(() => this.categoriesStore.categoryById(this.categoryId()));

  protected readonly associatedTasks = computed(() =>
    this.tasksStore.userTasks().filter((task) => task.categoryId === this.categoryId()),
  );
}