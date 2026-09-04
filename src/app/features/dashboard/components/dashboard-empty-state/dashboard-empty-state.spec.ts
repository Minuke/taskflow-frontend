import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardEmptyState } from './dashboard-empty-state';

describe('DashboardEmptyState', () => {
  let component: DashboardEmptyState;
  let fixture: ComponentFixture<DashboardEmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEmptyState],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardEmptyState);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
