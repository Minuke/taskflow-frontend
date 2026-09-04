import { Location } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TaskForm } from '@features/tasks/components/task-form/task-form';

@Component({
  selector: 'app-task-create-panel',
  imports: [TaskForm],
  templateUrl: './task-create-panel.html',
  styleUrl: './task-create-panel.scss',
})
export class TaskCreatePanel {
  readonly presetCategoryId = input<string | null>(null);

  private readonly location = inject(Location);
  private readonly router = inject(Router);

  protected async onSaved(): Promise<void> {
    const categoryId = this.presetCategoryId();
    if (categoryId) {
      await this.router.navigate(['/categories', categoryId]);
    } else {
      await this.router.navigate(['/tasks']);
    }
  }

  protected goBack(): void {
    this.location.back();
  }
}
