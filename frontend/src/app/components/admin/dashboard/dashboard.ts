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

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit() {
    this.fetchDashboardStats();
  }

  fetchDashboardStats() {
    // We will make parallel requests to get counts
    let completedRequests = 0;
    const checkLoading = () => {
      completedRequests++;
      if (completedRequests === 4) {
        this.isLoading = false;
      }
    };

    this.adminDataService.getUsers().subscribe(res => {
      if (res.data) this.totalUsers = res.data.length;
      checkLoading();
    });

    this.adminDataService.getBookings().subscribe(res => {
      if (res.data) {
        this.totalBookings = res.data.length;
        this.totalRevenue = res.data.reduce((sum: number, booking: any) => sum + (booking.totalAmount || 0), 0);
      }
      checkLoading();
    });

    this.adminDataService.getFlights().subscribe(res => {
      if (res.data) this.totalFlights = res.data.length;
      checkLoading();
    });

    this.adminDataService.getCarriers().subscribe(res => {
      if (res.data) this.totalCarriers = res.data.length;
      checkLoading();
    });
  }
}
