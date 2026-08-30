import { Component, inject, signal, computed, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TasksStore } from '@core/services/tasks-store';
import { CategoriesStore } from '@core/services/categories-store';
import { ConfirmDialog } from '@shared/components/confirm-dialog/confirm-dialog';
import { Pagination } from '@shared/components/pagination/pagination';
import { SkeletonList } from '@shared/components/skeleton-list/skeleton-list';
import { Task } from '@core/models/task.model';
import { Priority } from '@core/models/priority.enum';
import { TaskStatus } from '@core/models/task-status.enum';
import { DueFilter } from '@core/models/due-filter.enum';
import { isOverdue, isDueToday, isUpcoming } from '@core/utils/task-date.utils';
import { priorityWeight } from '@core/utils/priority.utils';
import { PriorityLabelPipe } from '@core/pipes/priority-label.pipe';

type TaskSortField = 'title' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-task-list',
  imports: [RouterLink, ConfirmDialog, Pagination, SkeletonList, PriorityLabelPipe],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  protected readonly tasksStore = inject(TasksStore);
  protected readonly categoriesStore = inject(CategoriesStore);

  private static readonly PAGE_SIZE = 10;

  protected readonly TaskStatus = TaskStatus;
  protected readonly Priority = Priority;
  protected readonly DueFilter = DueFilter;
  protected readonly pageSize = TaskList.PAGE_SIZE;

  protected readonly deletingTask = signal<Task | null>(null);
  protected readonly currentPage = signal(1);

  protected readonly searchTerm = signal('');
  protected readonly statusFilter = signal<TaskStatus>(TaskStatus.All);
  protected readonly priorityFilter = signal<Priority | 'all'>('all');
  protected readonly categoryFilter = signal<number | 'all'>('all');
  protected readonly dueFilter = signal<DueFilter>(DueFilter.All);
  protected readonly priorityOnlyFilter = signal(false);
  protected readonly sortField = signal<TaskSortField>('dueDate');
  protected readonly sortDirection = signal<SortDirection>('asc');

  protected readonly paginatedTasks = computed(() => {
    const tasks = this.filteredTasks();
    const start = (this.currentPage() - 1) * this.pageSize;
    return tasks.slice(start, start + this.pageSize);
  });

  protected readonly totalFilteredTasks = computed(() => this.filteredTasks().length);

  private readonly searchedTasks = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
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
    const status = this.statusFilter();
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
    const priority = this.priorityFilter();
    const tasks = this.statusFilteredTasks();
    return priority === 'all' ? tasks : tasks.filter((task) => task.priority === priority);
  });

  private readonly categoryFilteredTasks = computed(() => {
    const categoryId = this.categoryFilter();
    const tasks = this.priorityFilteredTasks();
    return categoryId === 'all' ? tasks : tasks.filter((task) => task.categoryId === categoryId);
  });

  private readonly priorityOnlyFilteredTasks = computed(() => {
    const onlyPriority = this.priorityOnlyFilter();
    const tasks = this.categoryFilteredTasks();
    return onlyPriority ? tasks.filter((task) => task.isPriority) : tasks;
  });

  private readonly dueFilteredTasks = computed(() => {
    const due = this.dueFilter();
    const tasks = this.priorityOnlyFilteredTasks();
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
      this.searchTerm();
      this.statusFilter();
      this.priorityFilter();
      this.categoryFilter();
      this.dueFilter();
      this.priorityOnlyFilter();
      this.sortField();
      this.sortDirection();
      this.currentPage.set(1);
    });
  }

  protected onRetry(): void {
    this.tasksStore.load();
  }

  protected onToggleComplete(taskId: number): void {
    this.tasksStore.toggleComplete(taskId);
  }

  protected isOverdue(dueDate: string | null): boolean {
    return isOverdue(dueDate);
  }

  protected categoryNameFor(categoryId: number | null): string {
    if (!categoryId) {
      return 'Sin categoría';
    }
    return (
      this.categoriesStore.userCategories().find((c) => c.id === categoryId)?.name ??
      'Sin categoría'
    );
  }

  protected onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  protected onStatusFilterChange(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value as TaskStatus);
  }

  protected onPriorityFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.priorityFilter.set(value === 'all' ? 'all' : (value as Priority));
  }

  protected onCategoryFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.categoryFilter.set(value === 'all' ? 'all' : Number(value));
  }

  protected onDueFilterChange(event: Event): void {
    this.dueFilter.set((event.target as HTMLSelectElement).value as DueFilter);
  }

  protected onPriorityOnlyFilterChange(event: Event): void {
    this.priorityOnlyFilter.set((event.target as HTMLInputElement).checked);
  }

  protected onSortFieldChange(event: Event): void {
    this.sortField.set((event.target as HTMLSelectElement).value as TaskSortField);
  }

  protected toggleSortDirection(): void {
    this.sortDirection.update((dir) => (dir === 'asc' ? 'desc' : 'asc'));
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
    const field = this.sortField();
    const direction = this.sortDirection();
    const factor = direction === 'asc' ? 1 : -1;

    return tasks.sort((a, b) => {
      switch (field) {
        case 'title':
          return a.title.localeCompare(b.title) * factor;
        case 'priority':
          return (priorityWeight(a.priority) - priorityWeight(b.priority)) * factor;
        case 'dueDate':
          return this.compareNullableDates(a.dueDate, b.dueDate) * factor;
        case 'createdAt':
          return a.createdAt.localeCompare(b.createdAt) * factor;
        case 'updatedAt':
          return a.updatedAt.localeCompare(b.updatedAt) * factor;
      }
    });
  }

  private compareNullableDates(a: string | null, b: string | null): number {
    if (a === b) return 0;
    if (a === null) return 1;
    if (b === null) return -1;
    return a.localeCompare(b);
  }
}