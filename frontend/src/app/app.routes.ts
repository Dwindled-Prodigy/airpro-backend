import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Admin } from './components/admin/admin';
import { Dashboard } from './components/admin/dashboard/dashboard';
import { AdminFlights } from './components/admin/flights/flights';
import { AdminCarriers } from './components/admin/carriers/carriers';
import { AdminUsers } from './components/admin/users/users';
import { AdminBookings } from './components/admin/bookings/bookings';
import { Auth } from './components/auth/auth';
import { Seats } from './components/booking/seats/seats';
import { Passengers } from './components/booking/passengers/passengers';
import { Payment } from './components/booking/payment/payment';
import { Confirmation } from './components/booking/confirmation/confirmation';

export const routes: Routes = [
    { path: '', component: Home },
    { 
      path: 'admin', 
      component: Admin,
      children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: Dashboard },
        { path: 'flights', component: AdminFlights },
        { path: 'carriers', component: AdminCarriers },
        { path: 'users', component: AdminUsers },
        { path: 'bookings', component: AdminBookings }
      ]
    },
    { path: 'auth', component: Auth },
    { path: 'booking/seats', component: Seats },
    { path: 'booking/passengers', component: Passengers },
    { path: 'booking/payment', component: Payment },
    { path: 'booking/confirmation', component: Confirmation },
    { path: '**', redirectTo: '' }
];
