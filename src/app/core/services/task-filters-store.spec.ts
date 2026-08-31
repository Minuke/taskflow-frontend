import { TestBed } from '@angular/core/testing';
import { TaskFiltersStore } from './task-filters-store';

describe('TaskFiltersStore', () => {
  let service: TaskFiltersStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskFiltersStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
