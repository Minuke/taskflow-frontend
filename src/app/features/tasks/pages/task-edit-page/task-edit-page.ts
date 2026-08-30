import { Component, inject, input, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TasksStore } from '@core/services/tasks-store';
import { TaskForm } from '@features/tasks/components/task-form/task-form';

@Component({
  selector: 'app-task-edit-page',
  imports: [RouterLink, TaskForm],
  templateUrl: './task-edit-page.html',
  styleUrl: './task-edit-page.scss',
})
export class TaskEditPage {
  readonly id = input.required<string>();

  private readonly tasksStore = inject(TasksStore);
  private readonly router = inject(Router);

  protected readonly task = computed(() => this.tasksStore.taskById(Number(this.id())));

  protected async onSaved(): Promise<void> {
    await this.router.navigate(['/tasks']);
  }

  protected async onCancelled(): Promise<void> {
    await this.router.navigate(['/tasks']);
  }
}