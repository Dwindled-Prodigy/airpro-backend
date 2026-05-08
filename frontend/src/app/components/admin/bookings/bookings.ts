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

  errorMessage = '';

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit() {
    this.fetchBookings();
  }

  fetchBookings() {
    this.adminDataService.getBookings().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.bookings = res.data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = "Access Denied. You must be an Administrator to view bookings.";
      }
    });
  }

  deleteBookingId: number | null = null;
  deleteMessage = '';

  confirmDelete(id: number) {
    this.deleteBookingId = id;
    this.deleteMessage = '';
  }

  cancelDelete() {
    this.deleteBookingId = null;
    this.deleteMessage = '';
  }

  deleteBooking() {
    if (this.deleteBookingId) {
      this.adminDataService.deleteBooking(this.deleteBookingId).subscribe({
        next: (res) => {
          if (res.status === 200) {
            this.fetchBookings();
            this.cancelDelete();
          }
        },
        error: (err) => {
          this.deleteMessage = "Cannot delete booking.";
        }
      });
    }
  }
}
