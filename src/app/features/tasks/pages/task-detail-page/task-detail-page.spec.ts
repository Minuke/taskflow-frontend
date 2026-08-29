import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailPage } from './task-detail-page';

describe('TaskDetailPage', () => {
  let component: TaskDetailPage;
  let fixture: ComponentFixture<TaskDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskDetailPage]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
