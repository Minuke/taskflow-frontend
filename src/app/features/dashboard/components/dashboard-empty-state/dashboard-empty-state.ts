import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-empty-state',
  imports: [RouterLink],
  templateUrl: './dashboard-empty-state.html',
  styleUrl: './dashboard-empty-state.scss',
})
export class DashboardEmptyState {}
