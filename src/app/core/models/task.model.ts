import type { Priority } from './priority.enum';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: Priority;
  estimatedHours: number;
  completed: boolean;
  dueDate: string | null;
  image: string | null;
  categoryId: number | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}
