import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CarrierRequest {
  name: string;
  discountPercentage: number;
  refundAllowed: boolean;
}

export interface FlightRequest {
  flightNumber: string;
  carrierId: number;
  origin: string;
  destination: string;
  basePrice: number;
  refundAllowed: boolean;
}

export interface ScheduleRequest {
  flightId: number;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminDataService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  // Carriers
  getCarriers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/carriers`);
  }

  createCarrier(carrier: CarrierRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/carriers`, carrier);
  }

  // Flights
  getFlights(): Observable<any> {
    return this.http.get(`${this.apiUrl}/flights`);
  }

  createFlight(flight: FlightRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/flights`, flight);
  }

  // Users
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  // Bookings
  getBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings`);
  }

  // Schedules
  getSchedules(): Observable<any> {
    return this.http.get(`${this.apiUrl}/schedules`);
  }

  createFullSchedule(schedule: ScheduleRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/schedules/full`, schedule);
  }

  // Delete Endpoints
  deleteCarrier(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/carriers/${id}`);
  }

  deleteFlight(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/flights/${id}`);
  }

  deleteSchedule(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/schedules/${id}`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bookings/${id}`);
  }
}
