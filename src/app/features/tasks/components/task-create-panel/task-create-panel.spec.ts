import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCreatePanel } from './task-create-panel';

describe('TaskCreatePanel', () => {
  let component: TaskCreatePanel;
  let fixture: ComponentFixture<TaskCreatePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCreatePanel]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskCreatePanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
