import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookingStateService } from '../../../services/booking-state.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css'
})
export class Confirmation implements OnInit {
  flight: any;
  passengers: any[] = [];
  pnr: string = '';

  constructor(
    private bookingState: BookingStateService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.bookingState.selectedFlight || !this.bookingState.passengers.length) {
      this.router.navigate(['/']);
      return;
    }
    
    this.flight = this.bookingState.selectedFlight;
    this.passengers = this.bookingState.passengers;
    this.pnr = this.flight.pnr || 'PNR-SUCCESS';
  }

  finish() {
    this.bookingState.clearState();
    this.router.navigate(['/']);
  }
}
