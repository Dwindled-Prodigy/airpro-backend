import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingStateService } from '../../../services/booking-state.service';

@Component({
  selector: 'app-passengers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './passengers.html',
  styleUrl: './passengers.css'
})
export class Passengers implements OnInit {
  flight: any;
  category: any;
  seats: string[] = [];
  passengers: any[] = [];
  
  contactMobile = '';
  contactEmail = '';
  
  totalFare = 0;
  showErrors = false;

  constructor(
    public bookingState: BookingStateService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.bookingState.selectedSeatsList || this.bookingState.selectedSeatsList.length === 0) {
      this.router.navigate(['/']);
      return;
    }
    
    this.flight = this.bookingState.selectedFlight;
    this.category = this.bookingState.selectedSeatCategory;
    this.seats = this.bookingState.selectedSeatsList;
    
    // Initialize empty forms for each passenger
    this.passengers = this.seats.map((seat, index) => ({
      title: 'Mr.',
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      age: '',
      idType: 'Aadhaar Card',
      idNumber: '',
      seat: seat,
      isPrimary: index === 0
    }));
    
    this.totalFare = this.bookingState.getTotalFare();
  }

  calculateAge(index: number) {
    const dob = this.passengers[index].dob;
    if (!dob) return;
    
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.passengers[index].age = age >= 0 ? `${age} Yrs` : "Invalid";
  }

  isValidMobile(): boolean {
    return /^\d{10}$/.test(this.contactMobile);
  }

  isValidEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.contactEmail);
  }

  proceedToPayment() {
    this.showErrors = true;
    
    // Basic validation
    let valid = true;
    for (let p of this.passengers) {
      if (!p.firstName || !p.lastName || !p.dob || !p.gender || !p.idNumber) {
        valid = false;
        break;
      }
    }
    
    if (!valid || !this.isValidMobile() || !this.isValidEmail()) {
      alert("Please fix the validation errors before proceeding.");
      return;
    }

    // Save to state
    this.bookingState.passengers = this.passengers;
    this.router.navigate(['/booking/payment']);
  }
}
