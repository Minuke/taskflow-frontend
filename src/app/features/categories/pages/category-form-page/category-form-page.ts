import { Component } from '@angular/core';
import { CategoryCreatePanel } from '@features/categories/components/category-create-panel/category-create-panel';

@Component({
  selector: 'app-category-form-page',
  imports: [CategoryCreatePanel],
  templateUrl: './category-form-page.html',
  styleUrl: './category-form-page.scss',
})
export class CategoryFormPage {}
