import { Component, inject, signal, computed } from '@angular/core';
import { TasksStore } from '@core/services/tasks-store';
import { CategoriesStore } from '@core/services/categories-store';
import { TaskForm } from '@features/tasks/components/task-form/task-form';
import { ConfirmDialog } from '@shared/components/confirm-dialog/confirm-dialog';
import { Task } from '@core/models/task.model';
import { Priority } from '@core/models/priority.enum';
import { TaskStatus } from '@core/models/task-status.enum';
import { DueFilter } from '@core/models/due-filter.enum';
import { isOverdue, isDueToday, isUpcoming } from '@core/utils/task-date.utils';
import { priorityWeight } from '@core/utils/priority.utils';

type TaskSortField = 'title' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-task-list',
  imports: [TaskForm, ConfirmDialog],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  protected readonly tasksStore = inject(TasksStore);
  protected readonly categoriesStore = inject(CategoriesStore);

  protected readonly TaskStatus = TaskStatus;
  protected readonly Priority = Priority;
  protected readonly DueFilter = DueFilter;

  protected readonly editingId = signal<number | null>(null);
  protected readonly deletingTask = signal<Task | null>(null);

  protected readonly searchTerm = signal('');
  protected readonly statusFilter = signal<TaskStatus>(TaskStatus.All);
  protected readonly priorityFilter = signal<Priority | 'all'>('all');
  protected readonly categoryFilter = signal<number | 'all'>('all');
  protected readonly dueFilter = signal<DueFilter>(DueFilter.All);
  protected readonly sortField = signal<TaskSortField>('dueDate');
  protected readonly sortDirection = signal<SortDirection>('asc');

  // Cadena de computed(): cada filtro parte del resultado del anterior.
  // Así se combinan todos a la vez sin recalcular desde cero en cada paso.
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

  private readonly dueFilteredTasks = computed(() => {
    const due = this.dueFilter();
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
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  protected onStatusFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as TaskStatus;
    this.statusFilter.set(value);
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
    const value = (event.target as HTMLSelectElement).value as DueFilter;
    this.dueFilter.set(value);
  }

  protected onSortFieldChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as TaskSortField;
    this.sortField.set(value);
  }

  protected toggleSortDirection(): void {
    this.sortDirection.update((dir) => (dir === 'asc' ? 'desc' : 'asc'));
  }

  protected onEdit(taskId: number): void {
    this.editingId.set(taskId);
  }

  protected onEditCancelled(): void {
    this.editingId.set(null);
  }

  protected onEditSaved(): void {
    this.editingId.set(null);
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
    if (a === null) return 1; // Sin fecha siempre al final, independientemente de la dirección de orden.
    if (b === null) return -1;
    return a.localeCompare(b);
  }
}