import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from './components/auth/auth';
import { AuthService } from './services/auth';
import { ServerStatusService } from './services/server-status.service';

@Component({
  selector: 'app-root',
  standalone: true,
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
  isServerDown = false;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private eRef: ElementRef,
    private serverStatus: ServerStatusService
  ) {}

  @HostListener('document:click')
  closeProfileDropdown() {
    this.isProfileOpen = false;
  }

  ngOnInit() {
    this.serverStatus.isServerDown$.subscribe(isDown => {
      this.isServerDown = isDown;
    });

    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
      if (user) {
        this.isAuthModalOpen = false;
      }
    });

    if (!this.isLoggedIn) {
      this.isAuthModalOpen = true;
    }

    this.authService.showLoginPrompt.subscribe(() => {
      this.isAuthModalOpen = true;
      this.isProfileOpen = false;
    });

    this.router.events.subscribe(event => {
      if (event && event.constructor.name === 'NavigationEnd') {
        const navEvent = event as any;
        this.isAdminRoute = navEvent.urlAfterRedirects.startsWith('/admin');
        this.isProfileOpen = false;
      }
    });
  }

  toggleProfile(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
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
