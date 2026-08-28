import { Service, inject, signal, computed } from '@angular/core';
import { AuthStore } from '@core/services/auth-store';
import { Task } from '@core/models/task.model';
import { Priority } from '@core/models/priority.enum';

export interface TaskInput {
  title: string;
  description: string | null;
  priority: Priority;
  estimatedHours: number;
  completed: boolean;
  dueDate: string | null;
  image: string | null;
  categoryId: number | null;
}

@Service()
export class TasksStore {
  private readonly authStore = inject(AuthStore);
  private readonly tasks = signal<Task[]>([]);
  private nextId = 1;

  readonly userTasks = computed(() => {
    const userId = this.authStore.user()?.id;
    if (!userId) {
      return [];
    }
    return this.tasks().filter((task) => task.userId === userId);
  });

  create(input: TaskInput): void {
    const userId = this.authStore.user()?.id;
    if (!userId) {
      throw new Error('NOT_AUTHENTICATED');
    }

    const newTask: Task = {
      id: this.nextId++,
      ...input,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tasks.update((list) => [...list, newTask]);
  }

  update(id: number, input: TaskInput): void {
    this.tasks.update((list) =>
      list.map((task) =>
        task.id === id ? { ...task, ...input, updatedAt: new Date().toISOString() } : task,
      ),
    );
  }
}