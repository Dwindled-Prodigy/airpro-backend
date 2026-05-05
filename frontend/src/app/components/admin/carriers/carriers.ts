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

  constructor(private adminData: AdminDataService) {}

  ngOnInit() {
    this.loadCarriers();
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
  }

  closeModal() {
    this.showModal = false;
    this.newCarrier = { name: '', discountPercentage: 0, refundAllowed: true };
  }

  saveCarrier() {
    this.adminData.createCarrier(this.newCarrier).subscribe(res => {
      if (res.success) {
        this.closeModal();
        this.loadCarriers(); // Refresh the list
      }
    });
  }
}
