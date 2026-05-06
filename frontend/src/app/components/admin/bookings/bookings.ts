import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService } from '../../../services/admin-data.service';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings.html'
})
export class AdminBookings implements OnInit {
  bookings: any[] = [];
  isLoading = true;

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit() {
    this.fetchBookings();
  }

  fetchBookings() {
    this.adminDataService.getBookings().subscribe(res => {
      if (res.data) {
        this.bookings = res.data;
      }
      this.isLoading = false;
    });
  }

  deleteBooking(id: number) {
    if (confirm("Are you sure you want to delete this booking?")) {
      this.adminDataService.deleteBooking(id).subscribe({
        next: (res) => {
          if (res.success) this.fetchBookings();
        },
        error: (err) => alert("Cannot delete booking.")
      });
    }
  }
}
