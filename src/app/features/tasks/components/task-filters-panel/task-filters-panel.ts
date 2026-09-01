import { Component, input, output, signal, computed } from '@angular/core';
import { Category } from '@core/models/category.model';
import { Priority } from '@core/models/priority.enum';
import { TaskStatus } from '@core/models/task-status.enum';
import { DueFilter } from '@core/models/due-filter.enum';

export type TaskSortField = 'title' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.All]: 'Todas',
  [TaskStatus.Pending]: 'Pendientes',
  [TaskStatus.Completed]: 'Completadas',
};

const PRIORITY_LABELS: Record<Priority | 'all', string> = {
  all: 'Todas',
  [Priority.Low]: 'Baja',
  [Priority.Medium]: 'Media',
  [Priority.High]: 'Alta',
};

const DUE_LABELS: Record<DueFilter, string> = {
  [DueFilter.All]: 'Todas',
  [DueFilter.Overdue]: 'Vencidas',
  [DueFilter.Today]: 'Hoy',
  [DueFilter.Upcoming]: 'Próximas',
  [DueFilter.NoDate]: 'Sin fecha',
};

const SORT_LABELS: Record<TaskSortField, string> = {
  updatedAt: 'Modificación',
  title: 'Título',
  priority: 'Prioridad',
  dueDate: 'Vencimiento',
  createdAt: 'Creación',
};

type AccordionKey = 'status' | 'priority' | 'category' | 'due' | 'sort';

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

  protected readonly isMobilePanelOpen = signal(false);

  // Plegado gestionado por nosotros (sin <details> nativo) para evitar los bugs
  // de posicionamiento de <select> y de colapso de tamaño descritos más arriba.
  protected readonly openAccordions = signal<Record<AccordionKey, boolean>>({
    status: false,
    priority: false,
    category: false,
    due: false,
    sort: true,
  });

  protected readonly statusLabel = computed(() => STATUS_LABELS[this.statusFilter()]);
  protected readonly priorityLabel = computed(() => PRIORITY_LABELS[this.priorityFilter()]);
  protected readonly dueLabel = computed(() => DUE_LABELS[this.dueFilter()]);
  protected readonly sortLabel = computed(
    () => `${SORT_LABELS[this.sortField()]} (${this.sortDirection() === 'asc' ? '↑' : '↓'})`,
  );

  protected readonly categoryLabel = computed(() => {
    const id = this.categoryFilter();
    if (id === 'all') {
      return 'Todas';
    }
    return this.categories().find((c) => c.id === id)?.name ?? 'Todas';
  });

  protected toggleMobilePanel(): void {
    this.isMobilePanelOpen.update((open) => !open);
  }

  protected isAccordionOpen(key: AccordionKey): boolean {
    return this.openAccordions()[key];
  }

  protected toggleAccordion(key: AccordionKey): void {
    this.openAccordions.update((state) => ({ ...state, [key]: !state[key] }));
  }

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