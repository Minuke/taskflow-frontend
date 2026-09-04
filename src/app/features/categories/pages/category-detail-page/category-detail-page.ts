import { Location } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FriendlyDatePipe } from '@core/pipes/friendly-date.pipe';
import { CategoriesStore } from '@core/services/categories-store';
import { TasksStore } from '@core/services/tasks-store';

@Component({
  selector: 'app-category-detail-page',
  imports: [RouterLink, FriendlyDatePipe],
  templateUrl: './category-detail-page.html',
  styleUrl: './category-detail-page.scss',
})
export class CategoryDetailPage {
  readonly id = input.required<string>();

  private readonly location = inject(Location);
  private readonly categoriesStore = inject(CategoriesStore);
  private readonly tasksStore = inject(TasksStore);

  protected readonly category = computed(() =>
    this.categoriesStore.categoryById(Number(this.id())),
  );

  protected readonly associatedTasks = computed(() =>
    this.tasksStore.userTasks().filter((task) => task.categoryId === Number(this.id())),
  );

  protected goBack(): void {
    this.location.back();
  }
}
