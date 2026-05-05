import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from './components/auth/auth';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, Auth],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'airpro-angular';
  
  isProfileOpen = false;
  isAuthModalOpen = false;
  isLoggedIn = false;
  currentUser: any = null;
  isAdminRoute = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
      if (user) {
        this.isAuthModalOpen = false;
      }
    });

    this.router.events.subscribe(event => {
      if (event && event.constructor.name === 'NavigationEnd') {
        const navEvent = event as any;
        this.isAdminRoute = navEvent.urlAfterRedirects.startsWith('/admin');
      }
    });
  }

  toggleProfile() {
    if (!this.isLoggedIn) {
      this.isAuthModalOpen = true;
    } else {
      this.isProfileOpen = !this.isProfileOpen;
    }
  }

  closeProfile() {
    this.isProfileOpen = false;
  }

  closeAuthModal() {
    this.isAuthModalOpen = false;
  }
  
  logout() {
    this.authService.logout();
    this.isProfileOpen = false;
    this.router.navigate(['/']);
  }
}
