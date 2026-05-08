import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-profile.html'
})
export class UserProfile implements OnInit {
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  
  isUpdating = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  updatePassword() {
    this.successMessage = '';
    this.errorMessage = '';
    
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New passwords do not match';
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(this.newPassword)) {
      this.errorMessage = 'Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character';
      return;
    }

    this.isUpdating = true;
    
    const payload = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };

    this.authService.updatePassword(payload).subscribe({
      next: (res) => {
        this.isUpdating = false;
        if (res.status === 200 || res.success || res.message) {
          this.successMessage = 'Password updated successfully!';
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        } else {
          this.errorMessage = res.message || 'Failed to update password';
        }
      },
      error: (err) => {
        this.isUpdating = false;
        this.errorMessage = err.error?.message || 'An error occurred while updating the password';
      }
    });
  }
}
