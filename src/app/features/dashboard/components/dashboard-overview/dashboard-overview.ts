import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TasksStore } from '@core/services/tasks-store';
import { Priority } from '@core/models/priority.enum';
import { DashboardSummary } from '@features/dashboard/components/dashboard-summary/dashboard-summary';
import { UpcomingTasks } from '@features/dashboard/components/upcoming-tasks/upcoming-tasks';
import { PriorityTasks } from '@features/dashboard/components/priority-tasks/priority-tasks';
import { RecentTasks } from '@features/dashboard/components/recent-tasks/recent-tasks';
import { DashboardEmptyState } from '@features/dashboard/components/dashboard-empty-state/dashboard-empty-state';
import { SkeletonList } from '@shared/components/skeleton-list/skeleton-list';

@Component({
  selector: 'app-dashboard-overview',
  imports: [
    RouterLink,
    DashboardSummary,
    UpcomingTasks,
    PriorityTasks,
    RecentTasks,
    DashboardEmptyState,
    SkeletonList,
  ],
  templateUrl: './dashboard-overview.html',
  styleUrl: './dashboard-overview.scss',
})
export class DashboardOverview {
  protected readonly tasksStore = inject(TasksStore);

  protected readonly hasUpcoming = computed(() =>
    this.tasksStore.userTasks().some((task) => !task.completed && task.dueDate !== null),
  );

  protected readonly hasPriority = computed(() =>
    this.tasksStore.userTasks().some((task) => task.priority === Priority.High && !task.completed),
  );

  protected readonly visibleColumnsCount = computed(() => {
    let count = 1; // "Tareas recientes" siempre está presente en esta rama.
    if (this.hasUpcoming()) count++;
    if (this.hasPriority()) count++;
    return count;
  });

  constructor() {
    this.tasksStore.load();
  }

  protected onRetry(): void {
    this.tasksStore.load();
  }
}