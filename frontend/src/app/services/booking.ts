import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:8080/api/bookings';

  constructor(private http: HttpClient) {}

  bookFlight(flightScheduleId: number, seatCategoryId: number, seatsToBook: number): Observable<any> {
    const payload = {
      flightScheduleId,
      seatCategoryId,
      seatsToBook
    };
    
    // We expect the auth interceptor to add the JWT automatically
    return this.http.post(this.apiUrl, payload);
  }

  getMyBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-bookings`);
  }

  cancelBooking(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/cancel`, {});
  }
}
