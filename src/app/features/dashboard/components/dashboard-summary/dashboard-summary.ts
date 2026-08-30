import { Component, inject, computed } from '@angular/core';
import { TasksStore } from '@core/services/tasks-store';
import { isDueToday } from '@core/utils/task-date.utils';

@Component({
  selector: 'app-dashboard-summary',
  imports: [],
  templateUrl: './dashboard-summary.html',
  styleUrl: './dashboard-summary.scss',
})
export class DashboardSummary {
  private readonly tasksStore = inject(TasksStore);

  protected readonly total = computed(() => this.tasksStore.userTasks().length);

  protected readonly pending = computed(
    () => this.tasksStore.userTasks().filter((task) => !task.completed).length,
  );

  protected readonly completed = computed(
    () => this.tasksStore.userTasks().filter((task) => task.completed).length,
  );

  protected readonly dueToday = computed(
    () =>
      this.tasksStore.userTasks().filter((task) => !task.completed && isDueToday(task.dueDate))
        .length,
  );

  protected readonly priorityCount = computed(
    () => this.tasksStore.userTasks().filter((task) => !task.completed && task.isPriority).length,
  );
}