import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoryForm } from '@features/categories/components/category-form/category-form';

@Component({
  selector: 'app-category-create-panel',
  imports: [CategoryForm, RouterLink],
  templateUrl: './category-create-panel.html',
  styleUrl: './category-create-panel.scss',
})
export class CategoryCreatePanel {
  private readonly router = inject(Router);

  protected async onSaved(): Promise<void> {
    await this.router.navigate(['/categories']);
  }
}
