import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private apiUrl = 'http://localhost:8080/api/flights';

  constructor(private http: HttpClient) {}

  searchFlights(origin: string, destination: string, travelDate: string): Observable<any> {
    const params = new HttpParams()
      .set('origin', origin)
      .set('destination', destination)
      .set('travelDate', travelDate);
      
    return this.http.get(`${this.apiUrl}/search`, { params });
  }
}
