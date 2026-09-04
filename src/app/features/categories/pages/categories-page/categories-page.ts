import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryList } from '@features/categories/components/category-list/category-list';

@Component({
  selector: 'app-categories-page',
  imports: [RouterLink, CategoryList],
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss',
})
export class CategoriesPage {}
