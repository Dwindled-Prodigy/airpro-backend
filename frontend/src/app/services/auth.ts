import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkSession();
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.status === 200 && res.data) {
          this.setSession(res.data);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('airpro_session');
    this.currentUserSubject.next(null);
  }

  private setSession(token: string) {
    localStorage.setItem('jwt_token', token);
    
    // Simple decode of JWT payload
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadStr = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadStr);
      
      const user = {
        name: payload.name || payload.sub,
        email: payload.sub,
        role: payload.role
      };
      
      localStorage.setItem('airpro_session', JSON.stringify(user));
      this.currentUserSubject.next(user);
    } catch (e) {
      console.error('Invalid token format');
    }
  }

  private checkSession() {
    const session = localStorage.getItem('airpro_session');
    if (session) {
      this.currentUserSubject.next(JSON.parse(session));
    }
  }
}
