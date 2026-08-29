import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpcomingTasks } from './upcoming-tasks';

describe('UpcomingTasks', () => {
  let component: UpcomingTasks;
  let fixture: ComponentFixture<UpcomingTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingTasks]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UpcomingTasks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
