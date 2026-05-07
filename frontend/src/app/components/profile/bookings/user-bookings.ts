import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../services/booking';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-bookings.html'
})
export class UserBookings implements OnInit {
  bookings: any[] = [];
  loading = true;

  constructor(
    private bookingService: BookingService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }
    this.loadMyBookings();
  }

  loadMyBookings() {
    this.bookingService.getMyBookings().subscribe({
      next: (res: any) => {
        if (res.success) {
          // Sort bookings by bookingTime descending
          this.bookings = res.data.sort((a: any, b: any) => {
            return new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime();
          });
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error("Error loading bookings", err);
        this.loading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  cancelBooking(booking: any) {
    if (confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      this.bookingService.cancelBooking(booking.id).subscribe({
        next: (res: any) => {
          if (res.success) {
            alert(res.message);
            this.loadMyBookings();
          }
        },
        error: (err: any) => {
          alert("Failed to cancel booking: " + (err.error?.message || "Unknown error"));
        }
      });
    }
  }

  getCityCode(city: any): string {
    return city ? String(city).substring(0, 3).toUpperCase() : '';
  }
}
