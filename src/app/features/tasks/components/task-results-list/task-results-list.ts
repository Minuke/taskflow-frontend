import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pagination } from '@shared/components/pagination/pagination';
import { PriorityLabelPipe } from '@core/pipes/priority-label.pipe';
import { FriendlyDatePipe } from '@core/pipes/friendly-date.pipe';
import { Task } from '@core/models/task.model';
import { Category } from '@core/models/category.model';
import { Priority } from '@core/models/priority.enum';
import { isOverdue } from '@core/utils/task-date.utils';

@Component({
  selector: 'app-task-results-list',
  imports: [RouterLink, Pagination, PriorityLabelPipe, FriendlyDatePipe],
  templateUrl: './task-results-list.html',
  styleUrl: './task-results-list.scss',
})
export class TaskResultsList {
  readonly tasks = input.required<Task[]>();
  readonly categories = input.required<Category[]>();
  readonly totalItems = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly currentPage = input.required<number>();

  readonly toggleComplete = output<number>();
  readonly deleteRequested = output<Task>();
  readonly pageChanged = output<number>();

  protected readonly Priority = Priority;

  protected isOverdue(dueDate: string | null): boolean {
    return isOverdue(dueDate);
  }

  protected categoryNameFor(categoryId: number | null): string {
    if (!categoryId) {
      return 'Sin categoría';
    }
    return this.categories().find((c) => c.id === categoryId)?.name ?? 'Sin categoría';
  }
}