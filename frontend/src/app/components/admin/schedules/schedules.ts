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

  constructor(private adminData: AdminDataService) {}

  ngOnInit() {
    this.loadSchedules();
    this.loadFlights();
  }

  loadSchedules() {
    this.adminData.getSchedules().subscribe(res => {
      if (res.success) {
        this.schedules = res.data;
      }
    });
  }

  loadFlights() {
    this.adminData.getFlights().subscribe(res => {
      if (res.success) {
        this.flights = res.data;
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

  saveSchedule() {
    this.adminData.createFullSchedule(this.newSchedule).subscribe({
      next: (res) => {
        if (res.success) {
          this.closeModal();
          this.loadSchedules();
        }
      },
      error: (err) => {
        alert("Failed to create schedule: " + (err.error?.message || "Unknown error"));
      }
    });
  }

  deleteSchedule(id: number) {
    if (confirm("Are you sure you want to delete this schedule?")) {
      this.adminData.deleteSchedule(id).subscribe({
        next: (res) => {
          if (res.success) this.loadSchedules();
        },
        error: (err) => alert("Cannot delete schedule (it may have bookings attached).")
      });
    }
  }
}
