import { Component, inject, signal, computed, effect } from '@angular/core';
import { TasksStore } from '@core/services/tasks-store';
import { CategoriesStore } from '@core/services/categories-store';
import { TaskFiltersStore } from '@core/services/task-filters-store';
import { ConfirmDialog } from '@shared/components/confirm-dialog/confirm-dialog';
import { SkeletonList } from '@shared/components/skeleton-list/skeleton-list';
import { TaskFiltersPanel } from '@features/tasks/components/task-filters-panel/task-filters-panel';
import { TaskResultsList } from '@features/tasks/components/task-results-list/task-results-list';
import { Task } from '@core/models/task.model';
import { TaskStatus } from '@core/models/task-status.enum';
import { DueFilter } from '@core/models/due-filter.enum';
import { isOverdue, isDueToday, isUpcoming } from '@core/utils/task-date.utils';
import { priorityWeight } from '@core/utils/priority.utils';
import { TaskSortField } from '@core/services/task-filters-store';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-task-list',
  imports: [ConfirmDialog, SkeletonList, TaskFiltersPanel, TaskResultsList],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  protected readonly tasksStore = inject(TasksStore);
  protected readonly categoriesStore = inject(CategoriesStore);
  protected readonly filtersStore = inject(TaskFiltersStore);

  protected readonly pageSize = PAGE_SIZE;

  protected readonly deletingTask = signal<Task | null>(null);
  protected readonly currentPage = signal(1);

  protected readonly hasActiveFilters = computed(
    () =>
      this.filtersStore.searchTerm().trim().length > 0 ||
      this.filtersStore.statusFilter() !== TaskStatus.All ||
      this.filtersStore.priorityFilter() !== 'all' ||
      this.filtersStore.categoryFilter() !== 'all' ||
      this.filtersStore.dueFilter() !== DueFilter.All,
  );

  protected readonly paginatedTasks = computed(() => {
    const tasks = this.filteredTasks();
    const start = (this.currentPage() - 1) * this.pageSize;
    return tasks.slice(start, start + this.pageSize);
  });

  protected readonly totalFilteredTasks = computed(() => this.filteredTasks().length);

  private readonly searchedTasks = computed(() => {
    const term = this.filtersStore.searchTerm().trim().toLowerCase();
    const tasks = this.tasksStore.userTasks();
    if (!term) {
      return tasks;
    }
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        (task.description ?? '').toLowerCase().includes(term),
    );
  });

  private readonly statusFilteredTasks = computed(() => {
    const status = this.filtersStore.statusFilter();
    const tasks = this.searchedTasks();
    if (status === TaskStatus.Pending) {
      return tasks.filter((task) => !task.completed);
    }
    if (status === TaskStatus.Completed) {
      return tasks.filter((task) => task.completed);
    }
    return tasks;
  });

  private readonly priorityFilteredTasks = computed(() => {
    const priority = this.filtersStore.priorityFilter();
    const tasks = this.statusFilteredTasks();
    return priority === 'all' ? tasks : tasks.filter((task) => task.priority === priority);
  });

  private readonly categoryFilteredTasks = computed(() => {
    const categoryId = this.filtersStore.categoryFilter();
    const tasks = this.priorityFilteredTasks();
    return categoryId === 'all' ? tasks : tasks.filter((task) => task.categoryId === categoryId);
  });

  private readonly dueFilteredTasks = computed(() => {
    const due = this.filtersStore.dueFilter();
    const tasks = this.categoryFilteredTasks();
    switch (due) {
      case DueFilter.Overdue:
        return tasks.filter((task) => isOverdue(task.dueDate));
      case DueFilter.Today:
        return tasks.filter((task) => isDueToday(task.dueDate));
      case DueFilter.Upcoming:
        return tasks.filter((task) => isUpcoming(task.dueDate));
      case DueFilter.NoDate:
        return tasks.filter((task) => task.dueDate === null);
      default:
        return tasks;
    }
  });

  protected readonly filteredTasks = computed(() => {
    const tasks = [...this.dueFilteredTasks()];
    return this.sortTasks(tasks);
  });

  constructor() {
    this.tasksStore.load();

    effect(() => {
      this.filtersStore.searchTerm();
      this.filtersStore.statusFilter();
      this.filtersStore.priorityFilter();
      this.filtersStore.categoryFilter();
      this.filtersStore.dueFilter();
      this.filtersStore.sortField();
      this.filtersStore.sortDirection();
      this.currentPage.set(1);
    });
  }

  protected onRetry(): void {
    this.tasksStore.load();
  }

  protected onCompleteRequested(taskId: number): void {
    this.tasksStore.complete(taskId);
  }

  protected resetFilters(): void {
    this.filtersStore.reset();
  }

  protected onDeleteRequested(task: Task): void {
    this.deletingTask.set(task);
  }

  protected onDeleteCancelled(): void {
    this.deletingTask.set(null);
  }

  protected onDeleteConfirmed(taskId: number): void {
    this.tasksStore.delete(taskId);
    this.deletingTask.set(null);
  }

  protected onPageChanged(page: number): void {
    this.currentPage.set(page);
  }

  private sortTasks(tasks: Task[]): Task[] {
    const field = this.filtersStore.sortField();
    const direction = this.filtersStore.sortDirection();
    const factor = direction === 'asc' ? 1 : -1;

    return tasks.sort((a, b) => {
      const primary = this.comparePrimary(a, b, field) * factor;
      if (primary !== 0) {
        return primary;
      }
      return priorityWeight(b.priority) - priorityWeight(a.priority);
    });
  }

  private comparePrimary(a: Task, b: Task, field: TaskSortField): number {
    switch (field) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'priority':
        return priorityWeight(a.priority) - priorityWeight(b.priority);
      case 'dueDate':
        return this.compareNullableDates(a.dueDate, b.dueDate);
      case 'createdAt':
        return a.createdAt.localeCompare(b.createdAt);
      case 'updatedAt':
        return a.updatedAt.localeCompare(b.updatedAt);
    }
  }

  private compareNullableDates(a: string | null, b: string | null): number {
    if (a === b) return 0;
    if (a === null) return 1;
    if (b === null) return -1;
    return a.localeCompare(b);
  }
}