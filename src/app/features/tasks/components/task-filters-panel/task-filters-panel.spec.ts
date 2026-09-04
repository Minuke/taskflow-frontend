import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFiltersPanel } from './task-filters-panel';

describe('TaskFiltersPanel', () => {
  let component: TaskFiltersPanel;
  let fixture: ComponentFixture<TaskFiltersPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFiltersPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFiltersPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
