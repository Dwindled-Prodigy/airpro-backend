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

  constructor(private adminDataService: AdminDataService) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.adminDataService.getUsers().subscribe(res => {
      if (res.data) {
        this.users = res.data;
      }
      this.isLoading = false;
    });
  }

  deleteUser(id: number) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.adminDataService.deleteUser(id).subscribe({
        next: (res) => {
          if (res.success) this.fetchUsers();
        },
        error: (err) => alert("Cannot delete user (they may have bookings attached).")
      });
    }
  }
}
