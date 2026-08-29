import { Component } from '@angular/core';
import { DashboardOverview } from '@features/dashboard/components/dashboard-overview/dashboard-overview';

@Component({
  selector: 'app-dashboard-page',
  imports: [DashboardOverview],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {}