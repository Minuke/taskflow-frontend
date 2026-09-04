import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskResultsList } from './task-results-list';

describe('TaskResultsList', () => {
  let component: TaskResultsList;
  let fixture: ComponentFixture<TaskResultsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskResultsList],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskResultsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
