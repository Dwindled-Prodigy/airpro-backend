import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingStateService {
  
  // Search state
  origin: string = '';
  destination: string = '';
  travelDate: string = '';
  passengerCount: number = 1;
  
  // Selected Flight state
  selectedFlight: any = null;
  selectedSeatCategory: any = null;
  selectedSeatsList: string[] = [];
  
  // Passengers State
  passengers: any[] = [];
  
  // Pricing State
  baseFare: number = 0;
  tax: number = 899;
  seatFee: number = 0;

  constructor() { }

  getTotalFare(): number {
    return (this.baseFare + this.tax) * this.passengerCount + this.seatFee;
  }
  
  clearState() {
    this.selectedFlight = null;
    this.selectedSeatCategory = null;
    this.selectedSeatsList = [];
    this.passengers = [];
    this.baseFare = 0;
    this.seatFee = 0;
  }
}
