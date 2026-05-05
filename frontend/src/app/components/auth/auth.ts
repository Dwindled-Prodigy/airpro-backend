import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  @Output() closeModal = new EventEmitter<void>();

  activeTab: 'login' | 'signup' = 'login';
  activeRole: 'customer' | 'admin' = 'customer';

  loginData = { email: '', password: '', rememberMe: false };
  signupData = { name: '', email: '', password: '', confirm: '' };
  
  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  onClose() {
    this.closeModal.emit();
  }

  setTab(tab: 'login' | 'signup') {
    this.activeTab = tab;
    this.errorMsg = '';
  }

  setRole(role: 'customer' | 'admin') {
    this.activeRole = role;
  }

  handleLogin() {
    this.errorMsg = '';
    this.authService.login({ email: this.loginData.email, password: this.loginData.password }).subscribe({
      next: (res) => {
        if (res.status !== 200) {
          this.errorMsg = res.message || 'Login failed';
        } else {
          // Check role validation
          this.authService.currentUser$.subscribe(user => {
            if (user) {
              if ((this.activeRole === 'admin' && user.role !== 'ADMIN') ||
                  (this.activeRole === 'customer' && user.role !== 'USER')) {
                this.errorMsg = "Invalid role selection for this account.";
                this.authService.logout();
              } else {
                this.closeModal.emit();
                if (user.role === 'ADMIN') {
                  this.router.navigate(['/admin/dashboard']);
                }
              }
            }
          });
        }
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.errorMsg = err.error.message;
        } else if (err.status === 401 || err.status === 403) {
          this.errorMsg = "Invalid email or password.";
        } else {
          this.errorMsg = 'Network error. Please try again.';
        }
        alert(this.errorMsg);
      }
    });
  }

  handleSignup() {
    this.errorMsg = '';
    if (this.signupData.password !== this.signupData.confirm) {
      this.errorMsg = "Passwords do not match";
      return;
    }
    
    this.authService.register({
      email: this.signupData.email,
      password: this.signupData.password,
      role: 'ROLE_USER',
      name: this.signupData.name
    }).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.setTab('login');
        } else {
          this.errorMsg = res.message || 'Registration failed';
        }
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.errorMsg = err.error.message;
        } else {
          this.errorMsg = 'Network error or email already exists. Please try again.';
        }
      }
    });
  }
}
