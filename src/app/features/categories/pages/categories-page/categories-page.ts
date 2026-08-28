import { Component } from '@angular/core';
import { CategoryForm } from '@features/categories/components/category-form/category-form';
import { CategoryList } from '@features/categories/components/category-list/category-list';

@Component({
  selector: 'app-categories-page',
  imports: [CategoryForm, CategoryList],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss',
})
export class CategoriesPage {}