import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-skeleton-list',
  imports: [],
  templateUrl: './skeleton-list.html',
  styleUrl: './skeleton-list.scss',
})
export class SkeletonList {
  readonly rows = input<number>(5);

  protected readonly rowsArray = computed(() => Array.from({ length: this.rows() }));
}