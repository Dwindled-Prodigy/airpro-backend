import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDataService, CarrierRequest } from '../../../services/admin-data.service';

@Component({
  selector: 'app-admin-carriers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carriers.html'
})
export class AdminCarriers implements OnInit {
  carriers: any[] = [];
  showModal = false;
  
  newCarrier: CarrierRequest = {
    name: '',
    discountPercentage: 0,
    refundAllowed: true
  };

  errorMessage = '';

  constructor(private adminData: AdminDataService) {}

  ngOnInit() {
    this.loadCarriers();
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
  }

  closeModal() {
    this.showModal = false;
    this.newCarrier = { name: '', discountPercentage: 0, refundAllowed: true };
  }

  createMessage = '';

  saveCarrier() {
    this.createMessage = '';
    this.adminData.createCarrier(this.newCarrier).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.closeModal();
          this.loadCarriers(); // Refresh the list
        }
      },
      error: (err) => {
        this.createMessage = "Failed to create carrier: " + (err.error?.message || "Unknown error");
      }
    });
  }

  deleteCarrierId: number | null = null;
  deleteMessage = '';

  confirmDelete(id: number) {
    this.deleteCarrierId = id;
    this.deleteMessage = '';
  }

  cancelDelete() {
    this.deleteCarrierId = null;
    this.deleteMessage = '';
  }

  deleteCarrier() {
    if (this.deleteCarrierId) {
      this.adminData.deleteCarrier(this.deleteCarrierId).subscribe({
        next: (res) => {
          if (res.status === 200) {
            this.loadCarriers();
            this.cancelDelete();
          }
        },
        error: (err) => {
          this.deleteMessage = "Cannot delete carrier (it may have flights attached).";
        }
      });
    }
  }
}
