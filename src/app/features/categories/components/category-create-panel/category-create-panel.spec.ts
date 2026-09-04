import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryCreatePanel } from './category-create-panel';

describe('CategoryCreatePanel', () => {
  let component: CategoryCreatePanel;
  let fixture: ComponentFixture<CategoryCreatePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryCreatePanel],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryCreatePanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
