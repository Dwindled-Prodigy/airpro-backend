import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDataService } from '../../../services/admin-data.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html'
})
export class AdminUsers implements OnInit {
  users: any[] = [];
  isLoading = true;

  errorMessage = '';

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.adminDataService.getUsers().subscribe({
      next: (res) => {
        if (res.data) {
          this.users = res.data;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = "Access Denied. You must be an Administrator to view users.";
      }
    });
  }

  deleteUserId: number | null = null;
  deleteMessage = '';

  confirmDelete(id: number) {
    this.deleteUserId = id;
    this.deleteMessage = '';
  }

  cancelDelete() {
    this.deleteUserId = null;
    this.deleteMessage = '';
  }

  deleteUser() {
    if (this.deleteUserId) {
      this.adminDataService.deleteUser(this.deleteUserId).subscribe({
        next: (res) => {
          if (res.status === 200) {
            this.fetchUsers();
            this.cancelDelete();
          }
        },
        error: (err) => {
          this.deleteMessage = "Cannot delete user (they may have bookings attached).";
        }
      });
    }
  }
}
