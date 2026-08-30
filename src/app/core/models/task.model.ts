import { Priority } from './priority.enum';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: Priority;
  isPriority: boolean;
  estimatedHours: number;
  completed: boolean;
  dueDate: string | null;
  image: string | null;
  categoryId: number | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}