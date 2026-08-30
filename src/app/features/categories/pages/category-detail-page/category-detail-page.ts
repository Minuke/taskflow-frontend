import { Component, inject, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CategoriesStore } from '@core/services/categories-store';
import { TasksStore } from '@core/services/tasks-store';
import { PriorityLabelPipe } from '@core/pipes/priority-label.pipe';


@Component({
  selector: 'app-category-detail-page',
  imports: [RouterLink, DatePipe, PriorityLabelPipe],
  templateUrl: './category-detail-page.html',
  styleUrl: './category-detail-page.scss',
})
export class CategoryDetailPage {
  readonly id = input.required<string>();

  private readonly categoriesStore = inject(CategoriesStore);
  private readonly tasksStore = inject(TasksStore);

  protected readonly category = computed(() => this.categoriesStore.categoryById(Number(this.id())));

  protected readonly associatedTasks = computed(() =>
    this.tasksStore.userTasks().filter((task) => task.categoryId === Number(this.id())),
  );
}