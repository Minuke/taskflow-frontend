import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskEditPage } from './task-edit-page';

describe('TaskEditPage', () => {
  let component: TaskEditPage;
  let fixture: ComponentFixture<TaskEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEditPage]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskEditPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
