import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TaskList } from '@features/tasks/components/task-list/task-list';

@Component({
  selector: 'app-tasks-page',
  imports: [RouterLink, TaskList],
  templateUrl: './tasks-page.html',
  styleUrl: './tasks-page.scss',
})
export class TasksPage {}