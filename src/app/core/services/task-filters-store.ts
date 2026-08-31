import { Service, signal, effect } from '@angular/core';
import { Priority } from '@core/models/priority.enum';
import { TaskStatus } from '@core/models/task-status.enum';
import { DueFilter } from '@core/models/due-filter.enum';

export type TaskSortField = 'title' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

interface PersistedTaskFilters {
  searchTerm: string;
  statusFilter: TaskStatus;
  priorityFilter: Priority | 'all';
  categoryFilter: number | 'all';
  dueFilter: DueFilter;
  sortField: TaskSortField;
  sortDirection: SortDirection;
}

const STORAGE_KEY = 'taskflow.task-filters';

// Todos los filtros arrancan neutros ("Todas"). El orden por defecto (modificación
// descendente) no es un "filtro" en sí, así que no se ve afectado por esta regla.
const DEFAULTS: PersistedTaskFilters = {
  searchTerm: '',
  statusFilter: TaskStatus.All,
  priorityFilter: 'all',
  categoryFilter: 'all',
  dueFilter: DueFilter.All,
  sortField: 'updatedAt',
  sortDirection: 'desc',
};

@Service()
export class TaskFiltersStore {
  private readonly persisted = this.loadFromStorage();

  readonly searchTerm = signal(this.persisted.searchTerm);
  readonly statusFilter = signal(this.persisted.statusFilter);
  readonly priorityFilter = signal(this.persisted.priorityFilter);
  readonly categoryFilter = signal(this.persisted.categoryFilter);
  readonly dueFilter = signal(this.persisted.dueFilter);
  readonly sortField = signal(this.persisted.sortField);
  readonly sortDirection = signal(this.persisted.sortDirection);

  constructor() {
    // Cada cambio en cualquier signal se persiste automáticamente. Al ser un
    // servicio root-provided, este estado ya sobrevive la navegación entre
    // rutas por sí solo; guardarlo en localStorage añade que también
    // sobreviva a recargar la página o cerrar el navegador.
    effect(() => {
      const snapshot: PersistedTaskFilters = {
        searchTerm: this.searchTerm(),
        statusFilter: this.statusFilter(),
        priorityFilter: this.priorityFilter(),
        categoryFilter: this.categoryFilter(),
        dueFilter: this.dueFilter(),
        sortField: this.sortField(),
        sortDirection: this.sortDirection(),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
      } catch {
        // localStorage puede fallar (modo privado, cuota llena...). No es crítico: se
        // pierde la persistencia, pero la app sigue funcionando con el estado en memoria.
      }
    });
  }

  reset(): void {
    this.searchTerm.set(DEFAULTS.searchTerm);
    this.statusFilter.set(DEFAULTS.statusFilter);
    this.priorityFilter.set(DEFAULTS.priorityFilter);
    this.categoryFilter.set(DEFAULTS.categoryFilter);
    this.dueFilter.set(DEFAULTS.dueFilter);
    this.sortField.set(DEFAULTS.sortField);
    this.sortDirection.set(DEFAULTS.sortDirection);
  }

  private loadFromStorage(): PersistedTaskFilters {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return DEFAULTS;
      }
      return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {
      return DEFAULTS;
    }
  }
}