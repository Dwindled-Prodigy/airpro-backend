import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService, FlightRequest } from '../../../services/admin-data.service';

@Component({
  selector: 'app-admin-flights',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flights.html'
})
export class AdminFlights implements OnInit {
  flights: any[] = [];
  carriers: any[] = [];
  showModal = false;
  
  newFlight: FlightRequest = {
    flightNumber: '',
    carrierId: 0,
    origin: '',
    destination: '',
    basePrice: 0,
    refundAllowed: true
  };

  constructor(private adminData: AdminDataService) {}

  ngOnInit() {
    this.loadFlights();
    this.loadCarriers();
  }

  loadFlights() {
    this.adminData.getFlights().subscribe(res => {
      if (res.success) {
        this.flights = res.data;
      }
    });
  }

  loadCarriers() {
    this.adminData.getCarriers().subscribe(res => {
      if (res.success) {
        this.carriers = res.data;
      }
    });
  }

  openModal() {
    this.showModal = true;
    if (this.carriers.length > 0 && this.newFlight.carrierId === 0) {
      this.newFlight.carrierId = this.carriers[0].id;
    }
  }

  closeModal() {
    this.showModal = false;
    this.newFlight = { 
      flightNumber: '', 
      carrierId: this.carriers.length > 0 ? this.carriers[0].id : 0, 
      origin: '', 
      destination: '', 
      basePrice: 0, 
      refundAllowed: true 
    };
  }

  saveFlight() {
    this.adminData.createFlight(this.newFlight).subscribe(res => {
      if (res.success) {
        this.closeModal();
        this.loadFlights();
      }
    });
  }

  deleteFlight(id: number) {
    if (confirm("Are you sure you want to delete this flight?")) {
      this.adminData.deleteFlight(id).subscribe({
        next: (res) => {
          if (res.success) this.loadFlights();
        },
        error: (err) => alert("Cannot delete flight (it may have schedules attached).")
      });
    }
  }
}
