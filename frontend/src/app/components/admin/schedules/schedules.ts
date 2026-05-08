import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService, ScheduleRequest } from '../../../services/admin-data.service';

@Component({
  selector: 'app-admin-schedules',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedules.html'
})
export class AdminSchedules implements OnInit {
  schedules: any[] = [];
  flights: any[] = [];
  showModal = false;
  
  newSchedule: ScheduleRequest = {
    flightId: 0,
    travelDate: '',
    departureTime: '',
    arrivalTime: ''
  };

  errorMessage = '';

  constructor(private adminData: AdminDataService) {}

  ngOnInit() {
    this.loadSchedules();
    this.loadFlights();
  }

  loadSchedules() {
    this.adminData.getSchedules().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.schedules = res.data;
        }
      },
      error: (err) => {
        this.errorMessage = "Access Denied. You must be an Administrator to view schedules.";
      }
    });
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

  openModal() {
    this.showModal = true;
    if (this.flights.length > 0 && this.newSchedule.flightId === 0) {
      this.newSchedule.flightId = this.flights[0].id;
    }
  }

  closeModal() {
    this.showModal = false;
    this.newSchedule = { 
      flightId: this.flights.length > 0 ? this.flights[0].id : 0, 
      travelDate: '', 
      departureTime: '', 
      arrivalTime: '' 
    };
  }

  deleteScheduleId: number | null = null;
  deleteMessage = '';
  createMessage = '';

  confirmDelete(id: number) {
    this.deleteScheduleId = id;
    this.deleteMessage = '';
  }

  cancelDelete() {
    this.deleteScheduleId = null;
    this.deleteMessage = '';
  }

  deleteSchedule() {
    if (this.deleteScheduleId) {
      this.adminData.deleteSchedule(this.deleteScheduleId).subscribe({
        next: (res) => {
          if (res.status === 200) {
            this.loadSchedules();
            this.cancelDelete();
          }
        },
        error: (err) => {
          this.deleteMessage = "Cannot delete schedule (it may have bookings attached).";
        }
      });
    }
  }

  saveSchedule() {
    this.createMessage = '';
    this.adminData.createFullSchedule(this.newSchedule).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.closeModal();
          this.loadSchedules();
        }
      },
      error: (err) => {
        this.createMessage = "Failed to create schedule: " + (err.error?.message || "Unknown error");
      }
    });
  }
}
