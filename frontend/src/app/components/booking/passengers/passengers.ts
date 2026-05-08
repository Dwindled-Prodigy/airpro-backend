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
  errorMessage = '';

  constructor(
    public bookingState: BookingStateService,
    private router: Router
  ) { }

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
    return /^[6-9]\d{9}$/.test(this.contactMobile);
  }

  isValidEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.contactEmail);
  }

  isDobValid(dob: string): boolean {
    if (!dob) return false;
    return new Date(dob) <= new Date();
  }

  isValidName(name: string): boolean {
    return /^[A-Za-z\s]+$/.test(name);
  }

  isValidId(idType: string, idNumber: string): boolean {
    if (!idNumber) return false;
    if (idType === 'Aadhaar Card') {
      return /^\d{12}$/.test(idNumber.replace(/\s/g, ''));
    } else if (idType === 'Passport') {
      return /^[A-Za-z0-9]{6,15}$/.test(idNumber.replace(/\s/g, ''));
    }
    return true;
  }

  isPrimaryAdult(): boolean {
    if (this.passengers.length === 0) return false;
    const p = this.passengers[0];
    if (!p.dob) return false;
    const birthDate = new Date(p.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  }

  proceedToPayment() {
    this.showErrors = true;
    this.errorMessage = '';

    // Basic validation
    let valid = true;
    for (let p of this.passengers) {
      if (!p.firstName || !p.lastName || !p.dob || !p.gender || !p.idNumber) {
        valid = false;
        break;
      }
      if (!this.isValidName(p.firstName) || !this.isValidName(p.lastName)) {
        this.errorMessage = "Names must contain only letters and spaces.";
        return;
      }
      if (!this.isDobValid(p.dob)) {
        this.errorMessage = "Date of Birth cannot be in the future.";
        return;
      }
      if (!this.isValidId(p.idType, p.idNumber)) {
        if (p.idType === 'Aadhaar Card') {
          this.errorMessage = "Invalid Aadhaar number.";
        } else if (p.idType === 'Passport') {
          this.errorMessage = "Invalid Passport number.";
        } else {
          this.errorMessage = `Invalid ${p.idType} number.`;
        }
        return;
      }
    }

    if (!valid) {
      this.errorMessage = "Please fill in all required passenger details.";
      return;
    }

    if (!this.isPrimaryAdult()) {
      this.errorMessage = "Primary passenger must be at least 18 years old.";
      return;
    }

    if (!this.isValidMobile() || !this.isValidEmail()) {
      this.errorMessage = "Please provide valid contact details.";
      return;
    }

    // Save to state
    this.bookingState.passengers = this.passengers;
    this.router.navigate(['/booking/payment']);
  }
}
