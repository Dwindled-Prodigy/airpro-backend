import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService } from '../../../services/admin-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  totalUsers = 0;
  totalBookings = 0;
  totalRevenue = 0;
  totalFlights = 0;
  totalCarriers = 0;
  isLoading = true;

  errorMessage = '';

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit() {
    this.fetchDashboardStats();
  }

  fetchDashboardStats() {
    let completedRequests = 0;
    let hasError = false;

    const checkLoading = () => {
      completedRequests++;
      if (completedRequests === 4) {
        this.isLoading = false;
      }
    };

    const handleError = (err: any) => {
      if (!hasError) {
        hasError = true;
        this.isLoading = false;
        this.errorMessage = "Access Denied. You must be an Administrator to view this dashboard.";
      }
    };

    this.adminDataService.getUsers().subscribe({
      next: (res) => { if (res.data) this.totalUsers = res.data.length; checkLoading(); },
      error: handleError
    });

    this.adminDataService.getBookings().subscribe({
      next: (res) => {
        if (res.data) {
          this.totalBookings = res.data.length;
          this.totalRevenue = res.data.reduce((sum: number, booking: any) => sum + (booking.totalAmount || 0), 0);
        }
        checkLoading();
      },
      error: handleError
    });

    this.adminDataService.getFlights().subscribe({
      next: (res) => { if (res.data) this.totalFlights = res.data.length; checkLoading(); },
      error: handleError
    });

    this.adminDataService.getCarriers().subscribe({
      next: (res) => { if (res.data) this.totalCarriers = res.data.length; checkLoading(); },
      error: handleError
    });
  }
}
