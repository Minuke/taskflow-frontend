import { TestBed } from '@angular/core/testing';
import { CategoriesStore } from './categories-store';

describe('CategoriesStore', () => {
  let service: CategoriesStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
