import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingStateService } from '../../../services/booking-state.service';
import { BookingService } from '../../../services/booking';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class Payment implements OnInit {
  cardNumber = '';
  expiry = '';
  cvv = '';
  nameOnCard = '';

  totalAmount = 0;
  isProcessing = false;
  paymentError = '';
  showErrors = false;

  constructor(
    public bookingState: BookingStateService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.bookingState.selectedFlight || !this.bookingState.passengers.length) {
      this.router.navigate(['/']);
      return;
    }
    
    this.totalAmount = this.bookingState.getTotalFare();
  }
  
  isValidCard(): boolean {
    // Basic 16 digit check ignoring spaces
    return /^\d{16}$/.test(this.cardNumber.replace(/\s/g, ''));
  }
  
  isValidExpiry(): boolean {
    return /^(0[1-9]|1[0-2])\/\d{2}$/.test(this.expiry);
  }
  
  isValidCvv(): boolean {
    return /^\d{3,4}$/.test(this.cvv);
  }

  processPayment() {
    this.showErrors = true;
    
    if (!this.isValidCard() || !this.isValidExpiry() || !this.isValidCvv() || !this.nameOnCard) {
      this.paymentError = 'Please fix the highlighted payment details.';
      return;
    }

    this.isProcessing = true;
    this.paymentError = '';

    // Simulate payment processing delay
    setTimeout(() => {
      this.bookingService.bookFlight(
        this.bookingState.selectedFlight.flightScheduleId,
        this.bookingState.selectedSeatCategory.seatCategoryId,
        this.bookingState.passengerCount
      ).subscribe({
        next: (res) => {
          this.isProcessing = false;
          if (res.status === 200 || res.status === 201 || res.data) {
            // Save PNR to state
            this.bookingState.selectedFlight.pnr = res.data?.pnr || 'PNR-SUCCESS';
            this.router.navigate(['/booking/confirmation']);
          } else {
            this.paymentError = res.message || 'Booking failed on the server.';
          }
        },
        error: (err) => {
          this.isProcessing = false;
          this.paymentError = err.error?.message || 'Failed to communicate with the server. Please check if you are logged in.';
        }
      });
    }, 1500); // 1.5s mock delay
  }
}
