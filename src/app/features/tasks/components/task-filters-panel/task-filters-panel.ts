import { Component, input, output } from '@angular/core';
import { Category } from '@core/models/category.model';
import { Priority } from '@core/models/priority.enum';
import { TaskStatus } from '@core/models/task-status.enum';
import { DueFilter } from '@core/models/due-filter.enum';

export type TaskSortField = 'title' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-task-filters-panel',
  imports: [],
  templateUrl: './task-filters-panel.html',
  styleUrl: './task-filters-panel.scss',
})
export class TaskFiltersPanel {
  readonly categories = input.required<Category[]>();

  readonly searchTerm = input.required<string>();
  readonly statusFilter = input.required<TaskStatus>();
  readonly priorityFilter = input.required<Priority | 'all'>();
  readonly categoryFilter = input.required<number | 'all'>();
  readonly dueFilter = input.required<DueFilter>();
  readonly sortField = input.required<TaskSortField>();
  readonly sortDirection = input.required<SortDirection>();
  readonly hasActiveFilters = input.required<boolean>();

  readonly searchChanged = output<string>();
  readonly statusChanged = output<TaskStatus>();
  readonly priorityChanged = output<Priority | 'all'>();
  readonly categoryChanged = output<number | 'all'>();
  readonly dueChanged = output<DueFilter>();
  readonly sortFieldChanged = output<TaskSortField>();
  readonly sortDirectionToggled = output<void>();
  readonly resetRequested = output<void>();

  protected readonly TaskStatus = TaskStatus;
  protected readonly Priority = Priority;
  protected readonly DueFilter = DueFilter;

  protected onSearchInput(event: Event): void {
    this.searchChanged.emit((event.target as HTMLInputElement).value);
  }

  protected onStatusChange(event: Event): void {
    this.statusChanged.emit((event.target as HTMLSelectElement).value as TaskStatus);
  }

  protected onPriorityChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.priorityChanged.emit(value === 'all' ? 'all' : (value as Priority));
  }

  protected onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.categoryChanged.emit(value === 'all' ? 'all' : Number(value));
  }

  protected onDueChange(event: Event): void {
    this.dueChanged.emit((event.target as HTMLSelectElement).value as DueFilter);
  }

  protected onSortFieldChange(event: Event): void {
    this.sortFieldChanged.emit((event.target as HTMLSelectElement).value as TaskSortField);
  }
}