import { Component, input } from '@angular/core';
import { TaskCreatePanel } from '@features/tasks/components/task-create-panel/task-create-panel';

@Component({
  selector: 'app-task-form-page',
  imports: [TaskCreatePanel],
  templateUrl: './task-form-page.html',
  styleUrl: './task-form-page.scss',
})
export class TaskFormPage {
  readonly categoryId = input<string>();
}
