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
  
  occupiedSeats: string[] = ['2B', '3D', '3E', '5A', '7C', '8F', '10B', '12D', '15A', '20C', '22E', '25B', '28F', '16A', '16B', '21D', '21E'];

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
