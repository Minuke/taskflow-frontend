import { Component, inject, input, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CategoriesStore } from '@core/services/categories-store';
import { CategoryForm } from '@features/categories/components/category-form/category-form';

@Component({
  selector: 'app-category-edit-page',
  imports: [RouterLink, CategoryForm],
  templateUrl: './category-edit-page.html',
  styleUrl: './category-edit-page.scss',
})
export class CategoryEditPage {
  readonly id = input.required<string>();

  private readonly categoriesStore = inject(CategoriesStore);
  private readonly router = inject(Router);

  protected readonly category = computed(() => this.categoriesStore.categoryById(Number(this.id())));

  protected async onSaved(): Promise<void> {
    await this.router.navigate(['/categories']);
  }

  protected async onCancelled(): Promise<void> {
    await this.router.navigate(['/categories']);
  }
}