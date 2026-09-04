import { Priority } from '@core/models/priority.enum';

const PRIORITY_WEIGHT: Record<Priority, number> = {
  [Priority.Low]: 0,
  [Priority.Medium]: 1,
  [Priority.High]: 2,
};

export function priorityWeight(priority: Priority): number {
  return PRIORITY_WEIGHT[priority];
}
