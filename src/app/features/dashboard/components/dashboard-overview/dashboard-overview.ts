import { Component, inject } from '@angular/core';
import { TasksStore } from '@core/services/tasks-store';
import { DashboardSummary } from '@features/dashboard/components/dashboard-summary/dashboard-summary';
import { UpcomingTasks } from '@features/dashboard/components/upcoming-tasks/upcoming-tasks';
import { RecentTasks } from '@features/dashboard/components/recent-tasks/recent-tasks';
import { DashboardEmptyState } from '@features/dashboard/components/dashboard-empty-state/dashboard-empty-state';
import { SkeletonList } from '@shared/components/skeleton-list/skeleton-list';

@Component({
  selector: 'app-dashboard-overview',
  imports: [DashboardSummary, UpcomingTasks, RecentTasks, DashboardEmptyState, SkeletonList],
  templateUrl: './dashboard-overview.html',
  styleUrl: './dashboard-overview.scss',
})
export class DashboardOverview {
  protected readonly tasksStore = inject(TasksStore);

  constructor() {
    this.tasksStore.load();
  }

  protected onRetry(): void {
    this.tasksStore.load();
  }
}