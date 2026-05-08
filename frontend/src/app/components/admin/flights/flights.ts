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

  errorMessage = '';

  constructor(private adminData: AdminDataService) {}

  ngOnInit() {
    this.loadFlights();
    this.loadCarriers();
  }

  loadFlights() {
    this.adminData.getFlights().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.flights = res.data;
        }
      },
      error: (err) => {
        this.errorMessage = "Access Denied. You must be an Administrator to view flights.";
      }
    });
  }

  loadCarriers() {
    this.adminData.getCarriers().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.carriers = res.data;
        }
      },
      error: (err) => {
        this.errorMessage = "Access Denied. You must be an Administrator to view carriers.";
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

  createMessage = '';

  saveFlight() {
    this.createMessage = '';
    this.adminData.createFlight(this.newFlight).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.closeModal();
          this.loadFlights();
        }
      },
      error: (err) => {
        this.createMessage = "Failed to create flight: " + (err.error?.message || "Unknown error");
      }
    });
  }

  deleteFlightId: number | null = null;
  deleteMessage = '';

  confirmDelete(id: number) {
    this.deleteFlightId = id;
    this.deleteMessage = '';
  }

  cancelDelete() {
    this.deleteFlightId = null;
    this.deleteMessage = '';
  }

  deleteFlight() {
    if (this.deleteFlightId) {
      this.adminData.deleteFlight(this.deleteFlightId).subscribe({
        next: (res) => {
          if (res.status === 200) {
            this.loadFlights();
            this.cancelDelete();
          }
        },
        error: (err) => {
          this.deleteMessage = "Cannot delete flight (it may have schedules attached).";
        }
      });
    }
  }
}
