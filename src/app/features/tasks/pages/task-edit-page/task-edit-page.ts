import { Location } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TasksStore } from '@core/services/tasks-store';
import { TaskForm } from '@features/tasks/components/task-form/task-form';

@Component({
  selector: 'app-task-edit-page',
  imports: [TaskForm],
  templateUrl: './task-edit-page.html',
  styleUrl: './task-edit-page.scss',
})
export class TaskEditPage {
  readonly id = input.required<string>();
  readonly returnTo = input<string>();

  private readonly location = inject(Location);
  private readonly tasksStore = inject(TasksStore);
  private readonly router = inject(Router);

  protected readonly task = computed(() => this.tasksStore.taskById(Number(this.id())));

  protected async onSaved(): Promise<void> {
    await this.router.navigateByUrl(this.returnTo() ?? '/tasks');
  }

  protected onCancelled(): void {
    this.location.back();
  }

  protected goBack(): void {
    this.location.back();
  }
}
