import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardOverview } from '@features/dashboard/components/dashboard-overview/dashboard-overview';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, DashboardOverview],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {}