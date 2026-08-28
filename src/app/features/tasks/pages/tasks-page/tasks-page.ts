import { Component } from '@angular/core';
import { TaskForm } from '@features/tasks/components/task-form/task-form';
import { TaskList } from '@features/tasks/components/task-list/task-list';

@Component({
  selector: 'app-tasks-page',
  imports: [TaskForm, TaskList],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.scss',
})
export class TasksPage {}