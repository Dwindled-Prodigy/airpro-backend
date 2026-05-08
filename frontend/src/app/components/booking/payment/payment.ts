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
  showConfirmModal = false;

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
  
  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 16) {
      value = value.substring(0, 16);
    }
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    this.cardNumber = formatted;
  }

  formatExpiry(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);
    if (value.length >= 3) {
      this.expiry = value.substring(0, 2) + '/' + value.substring(2, 4);
    } else if (value.length >= 2 && event.inputType !== 'deleteContentBackward') {
       this.expiry = value.substring(0, 2) + '/';
    } else {
      this.expiry = value;
    }
  }

  formatCvv(event: any) {
     let value = event.target.value.replace(/\D/g, '');
     if (value.length > 4) value = value.substring(0, 4);
     this.cvv = value;
  }

  isValidCard(): boolean {
    let value = this.cardNumber.replace(/\D/g, '');
    if (value.length !== 16) return false;
    let sum = 0;
    for (let i = 0; i < value.length; i++) {
      let intVal = parseInt(value.substr(i, 1));
      if (i % 2 === 0) {
        intVal *= 2;
        if (intVal > 9) intVal = 1 + (intVal % 10);
      }
      sum += intVal;
    }
    return sum % 10 === 0;
  }
  
  isValidExpiry(): boolean {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(this.expiry)) return false;
    const [month, year] = this.expiry.split('/');
    const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const today = new Date();
    
    // Set to last day of expiry month
    expDate.setMonth(expDate.getMonth() + 1);
    expDate.setDate(0);
    
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 10);
    
    return expDate >= today && expDate <= maxDate;
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

    const storageKey = `booked_seats_${this.bookingState.selectedFlight.flightScheduleId}`;
    const previouslyBooked = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const alreadyBooked = this.bookingState.selectedSeatsList.some(s => previouslyBooked.includes(s));
    if (alreadyBooked) {
        this.paymentError = "One or more of your selected seats have just been booked by someone else. Please go back and select different seats.";
        return;
    }

    // Show the confirmation modal instead of processing immediately
    this.paymentError = '';
    this.showConfirmModal = true;
  }

  confirmPayment() {
    this.showConfirmModal = false;
    this.isProcessing = true;
    this.paymentError = '';

    const storageKey = `booked_seats_${this.bookingState.selectedFlight.flightScheduleId}`;
    const previouslyBooked = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const alreadyBooked = this.bookingState.selectedSeatsList.some(s => previouslyBooked.includes(s));
    if (alreadyBooked) {
        this.paymentError = "One or more of your selected seats have just been booked by someone else. Please go back and select different seats.";
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
            // Save newly booked seats to local storage mock
            const newBooked = [...previouslyBooked, ...this.bookingState.selectedSeatsList];
            localStorage.setItem(storageKey, JSON.stringify(newBooked));

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
