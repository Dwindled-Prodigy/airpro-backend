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
        if (res.status === 200 || res.data) {
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

  confirmingCancelId: number | null = null;

  cancelBooking(booking: any) {
    this.bookingService.cancelBooking(booking.id).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          // Clear local storage visual seat caches so seats appear restored in the seat map
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('booked_seats_')) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(k => localStorage.removeItem(k));
          
          this.confirmingCancelId = null;
          this.loadMyBookings();
        }
      },
      error: (err: any) => {
        alert("Failed to cancel booking: " + (err.error?.message || "Unknown error"));
        this.confirmingCancelId = null;
      }
    });
  }

  getCityCode(city: any): string {
    return city ? String(city).substring(0, 3).toUpperCase() : '';
  }
}
