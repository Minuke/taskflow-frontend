import { Pipe, PipeTransform } from '@angular/core';
import { Priority } from '@core/models/priority.enum';

const PRIORITY_LABELS: Record<Priority, string> = {
  [Priority.Low]: 'Baja',
  [Priority.Medium]: 'Media',
  [Priority.High]: 'Alta',
};

@Pipe({
  name: 'priorityLabel',
})
export class PriorityLabelPipe implements PipeTransform {
  transform(priority: Priority): string {
    return PRIORITY_LABELS[priority];
  }
}