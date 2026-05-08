import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingStateService } from '../../../services/booking-state.service';

@Component({
  selector: 'app-seats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seats.html',
  styleUrl: './seats.css'
})
export class Seats implements OnInit {
  flight: any;
  category: any;
  selectedSeats: string[] = [];
  
  rows: number[] = Array.from({length: 30}, (_, i) => i + 1);
  cols: string[] = ['A', 'B', 'C', 'aisle', 'D', 'E', 'F'];
  
  occupiedSeats: string[] = [];

  constructor(
    private bookingState: BookingStateService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.bookingState.selectedFlight || !this.bookingState.selectedSeatCategory) {
      this.router.navigate(['/']);
      return;
    }
    
    this.flight = this.bookingState.selectedFlight;
    this.category = this.bookingState.selectedSeatCategory;
    
    this.generateOccupiedSeats();
  }

  generateOccupiedSeats() {
    const catName = this.category.categoryName.toLowerCase();
    let startRow = 11, endRow = 30, totalCapacity = 120;
    
    if (catName.includes('business')) { 
      startRow = 1; endRow = 5; totalCapacity = 30; 
    } else if (catName.includes('premium')) { 
      startRow = 6; endRow = 10; totalCapacity = 30; 
    }
    
    const backendTotal = this.category.totalSeats || totalCapacity;
    const available = this.category.availableSeats || backendTotal;
    const backendBookedCount = Math.max(0, backendTotal - available);
    
    const storageKey = `booked_seats_${this.flight.flightScheduleId}`;
    const previouslyBooked: string[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    const allValidSeats: string[] = [];
    for (let r = startRow; r <= endRow; r++) {
      for (const c of this.cols) {
        const seatId = `${r}${c}`;
        if (c !== 'aisle' && !previouslyBooked.includes(seatId)) {
          allValidSeats.push(seatId);
        }
      }
    }
    
    const remainingToMock = Math.max(0, backendBookedCount - previouslyBooked.length);
    const randomMockSeats = allValidSeats.sort(() => 0.5 - Math.random()).slice(0, remainingToMock);
    
    this.occupiedSeats = [...previouslyBooked, ...randomMockSeats];
  }
  
  getSeatType(row: number): string {
    if (row <= 5) return 'Business';
    if (row <= 10) return 'Premium Economy';
    return 'Economy';
  }
  
  isSeatAllowed(row: number): boolean {
    const seatType = this.getSeatType(row);
    const catName = this.category.categoryName;
    
    // Logic matching DB categories to seat map rows
    if (catName.toLowerCase().includes('business')) return seatType === 'Business';
    if (catName.toLowerCase().includes('premium')) return seatType === 'Premium Economy';
    return seatType === 'Economy';
  }

  isOccupied(seatId: string): boolean {
    return this.occupiedSeats.includes(seatId);
  }

  isSelected(seatId: string): boolean {
    return this.selectedSeats.includes(seatId);
  }

  toggleSeat(row: number, col: string) {
    if (col === 'aisle') return;
    
    const seatId = `${row}${col}`;
    if (this.isOccupied(seatId)) return;
    
    if (!this.isSeatAllowed(row)) {
      alert(`You selected a ${this.category.categoryName} fare. Please select seats in the ${this.category.categoryName} section.`);
      return;
    }

    if (this.isSelected(seatId)) {
      this.selectedSeats = this.selectedSeats.filter(s => s !== seatId);
    } else {
      if (this.selectedSeats.length >= 8) {
        alert('You can only select a maximum of 8 seats per booking.');
        return;
      }
      this.selectedSeats.push(seatId);
    }
  }

  confirmSelection() {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least 1 seat to continue.');
      return;
    }
    
    this.bookingState.passengerCount = this.selectedSeats.length;
    this.bookingState.selectedSeatsList = this.selectedSeats;
    this.router.navigate(['/booking/passengers']);
  }
}
