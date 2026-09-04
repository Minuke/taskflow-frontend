import { Component, inject, input, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { TasksStore } from '@core/services/tasks-store';
import { CategoriesStore } from '@core/services/categories-store';
import { PriorityLabelPipe } from '@core/pipes/priority-label.pipe';
import { FriendlyDatePipe } from '@core/pipes/friendly-date.pipe';
import { ConfirmDialog } from '@shared/components/confirm-dialog/confirm-dialog';
import { Priority } from '@core/models/priority.enum';

@Component({
  selector: 'app-task-detail-page',
  imports: [RouterLink, PriorityLabelPipe, FriendlyDatePipe, ConfirmDialog],
  templateUrl: './task-detail-page.html',
  styleUrl: './task-detail-page.scss',
})
export class TaskDetailPage {
  readonly id = input.required<string>();
  readonly returnTo = input<string>();

  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly tasksStore = inject(TasksStore);
  private readonly categoriesStore = inject(CategoriesStore);

  protected readonly Priority = Priority;
  protected readonly showDeleteConfirm = signal(false);

  protected readonly effectiveReturnTo = computed(() => this.returnTo() ?? '/tasks');

  protected readonly task = computed(() => this.tasksStore.taskById(Number(this.id())));

  protected readonly categoryName = computed(() => {
    const categoryId = this.task()?.categoryId ?? null;
    if (!categoryId) {
      return 'Sin categoría';
    }
    return (
      this.categoriesStore.userCategories().find((c) => c.id === categoryId)?.name ??
      'Sin categoría'
    );
  });

  protected goBack(): void {
    this.location.back();
  }

  protected onDeleteRequested(): void {
    this.showDeleteConfirm.set(true);
  }

  protected onDeleteCancelled(): void {
    this.showDeleteConfirm.set(false);
  }

  protected async onDeleteConfirmed(): Promise<void> {
    const current = this.task();
    if (!current) {
      return;
    }
    this.tasksStore.delete(current.id);
    this.showDeleteConfirm.set(false);
    await this.router.navigateByUrl(this.effectiveReturnTo());
  }

  protected async onComplete(): Promise<void> {
    const current = this.task();
    if (!current) {
      return;
    }
    this.tasksStore.complete(current.id);
    await this.router.navigateByUrl(this.effectiveReturnTo());
  }
}