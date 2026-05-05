import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.html'
})
export class Admin {
  pageTitle = 'Dashboard';

  setPageTitle(title: string) {
    this.pageTitle = title;
  }
}
