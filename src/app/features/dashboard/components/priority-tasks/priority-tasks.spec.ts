import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { PriorityTasks } from './priority-tasks';

describe('PriorityTasks', () => {
  let component: PriorityTasks;
  let fixture: ComponentFixture<PriorityTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorityTasks],
    }).compileComponents();

    fixture = TestBed.createComponent(PriorityTasks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
