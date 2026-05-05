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
}
