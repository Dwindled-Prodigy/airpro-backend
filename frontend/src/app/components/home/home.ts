import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../services/flight';
import { BookingStateService } from '../../services/booking-state.service';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  origin = '';
  destination = '';
  travelDate = '';
  minDate: string = '';

  availableCities = [
    { code: 'DEL', name: 'New Delhi' },
    { code: 'BOM', name: 'Mumbai' },
    { code: 'BLR', name: 'Bangalore' },
    { code: 'MAA', name: 'Chennai' },
    { code: 'CCU', name: 'Kolkata' },
    { code: 'HYD', name: 'Hyderabad' },
    { code: 'PNQ', name: 'Pune' },
    { code: 'AMD', name: 'Ahmedabad' },
    { code: 'GOI', name: 'Goa' },
    { code: 'IDR', name: 'Indore' },
    { code: 'JAI', name: 'Jaipur' }
  ];

  searchResults: any[] = [];
  isSearching = false;
  searchError = '';
  isLoggedIn = false;

  constructor(
    private flightService: FlightService,
    private bookingState: BookingStateService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.minDate = `${year}-${month}-${day}`;

    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (!this.isLoggedIn) {
        this.searchResults = []; // Clear results on logout
      }
    });
  }

  handleSearch() {
    if (!this.isLoggedIn) {
      alert("Please login or sign up first to search for flights.");
      return;
    }

    if (!this.origin || !this.destination || !this.travelDate) {
      this.searchError = "Please fill in all search fields.";
      return;
    }

    this.searchError = '';
    this.isSearching = true;

    this.flightService.searchFlights(this.origin, this.destination, this.travelDate).subscribe({
      next: (res) => {
        this.isSearching = false;
        if (res.status === 200 && res.data) {
          this.searchResults = res.data;
          if (this.searchResults.length === 0) {
            this.searchError = "No flights found for this route and date.";
          }
        }
      },
      error: (err) => {
        this.isSearching = false;
        this.searchError = err.error?.message || "Failed to search flights. Please check your connection.";
      }
    });
  }

  selectFlight(flight: any, seatCategory: any) {
    // Save to state
    this.bookingState.origin = this.origin;
    this.bookingState.destination = this.destination;
    this.bookingState.travelDate = this.travelDate;
    this.bookingState.selectedFlight = flight;
    this.bookingState.selectedSeatCategory = seatCategory;
    this.bookingState.baseFare = seatCategory.price;

    // Route to seat selection
    this.router.navigate(['/booking/seats']);
  }
}
