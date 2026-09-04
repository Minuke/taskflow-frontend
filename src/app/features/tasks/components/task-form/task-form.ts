import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import {
  disabled,
  FormField,
  form,
  maxLength,
  min,
  minLength,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import { Priority } from '@core/models/priority.enum';
import type { Task } from '@core/models/task.model';
import { CategoriesStore } from '@core/services/categories-store';
import { type TaskInput, TasksStore } from '@core/services/tasks-store';
import { todayIsoDate } from '@core/utils/task-date.utils';

interface TaskFormModel {
  title: string;
  description: string;
  priority: Priority;
  estimatedHours: number;
  completed: boolean;
  dueDate: string;
  image: string | null;
  categoryId: string;
}

@Component({
  selector: 'app-task-form',
  imports: [FormField],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm {
  private readonly tasksStore = inject(TasksStore);
  protected readonly categoriesStore = inject(CategoriesStore);

  readonly task = input<Task | null>(null);
  readonly presetCategoryId = input<string | null>(null);
  readonly saved = output<void>();
  readonly cancelled = output<void>();

  protected readonly Priority = Priority;
  protected readonly minDueDate = todayIsoDate();

  protected readonly isCategoryLocked = computed(
    () => !this.task() && this.presetCategoryId() !== null,
  );

  protected readonly model = signal<TaskFormModel>(this.emptyModel());

  protected readonly taskForm = form(this.model, (schema) => {
    required(schema.title, { message: 'El título es obligatorio.' });
    minLength(schema.title, 3, { message: 'El título debe tener al menos 3 caracteres.' });
    maxLength(schema.title, 80, { message: 'El título no puede superar los 80 caracteres.' });
    maxLength(schema.description, 500, {
      message: 'La descripción no puede superar los 500 caracteres.',
    });
    required(schema.estimatedHours, { message: 'Las horas estimadas son obligatorias.' });
    min(schema.estimatedHours, 0, { message: 'Las horas estimadas no pueden ser negativas.' });

    disabled(schema.categoryId, {
      when: () => this.isCategoryLocked(),
    });

    validate(schema.dueDate, ({ value }) => {
      const dueDate = value();
      if (!dueDate || dueDate >= todayIsoDate()) {
        return null;
      }
      return { kind: 'pastDueDate', message: 'La fecha límite no puede ser anterior a hoy.' };
    });
  });

  constructor() {
    effect(() => {
      const current = this.task();
      const preset = this.presetCategoryId();

      if (current) {
        this.model.set(this.modelFromTask(current));
      } else {
        this.model.set({ ...this.emptyModel(), categoryId: preset ?? '' });
      }
    });
  }

  protected onImageSelected(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.model.update((m) => ({ ...m, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  protected removeImage(): void {
    this.model.update((m) => ({ ...m, image: null }));
  }

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    await submit(this.taskForm, async () => {
      const value = this.model();
      const taskInput: TaskInput = {
        title: value.title,
        description: value.description.trim() || null,
        priority: value.priority,
        estimatedHours: value.estimatedHours,
        completed: value.completed,
        dueDate: value.dueDate || null,
        image: value.image,
        categoryId: value.categoryId ? Number(value.categoryId) : null,
      };

      const existing = this.task();
      if (existing) {
        this.tasksStore.update(existing.id, taskInput);
      } else {
        this.tasksStore.create(taskInput);
        this.model.set(this.emptyModel());
        this.taskForm().reset();
      }

      this.saved.emit();
    });
  }

  private emptyModel(): TaskFormModel {
    return {
      title: '',
      description: '',
      priority: Priority.Medium,
      estimatedHours: 0,
      completed: false,
      dueDate: '',
      image: null,
      categoryId: '',
    };
  }

  private modelFromTask(task: Task): TaskFormModel {
    return {
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      estimatedHours: task.estimatedHours,
      completed: task.completed,
      dueDate: task.dueDate ?? '',
      image: task.image,
      categoryId: task.categoryId ? String(task.categoryId) : '',
    };
  }
}
