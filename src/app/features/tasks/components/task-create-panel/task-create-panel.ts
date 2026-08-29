import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TaskForm } from '@features/tasks/components/task-form/task-form';

@Component({
  selector: 'app-task-create-panel',
  imports: [TaskForm, RouterLink],
  templateUrl: './task-create-panel.html',
  styleUrl: './task-create-panel.scss',
})
export class TaskCreatePanel {
  private readonly router = inject(Router);

  protected async onSaved(): Promise<void> {
    await this.router.navigate(['/tasks']);
  }
}