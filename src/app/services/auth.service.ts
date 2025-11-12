import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../models/login-request.model';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../models/jwt-payload.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private apiUrl: string = 'https://localhost:7205/api/authentication';
  private apiUrl: string =
    'http://bilalsajid-001-site1.mtempurl.com/api/authentication';

  constructor(private http: HttpClient) {}

  getDecodeToken() {
    const token = this.getToken();
    if (!token) return null;
    return jwtDecode<JwtPayload>(token);
  }

  getCompanyName() {
    const decodeToken = this.getDecodeToken();
    return decodeToken?.CompanyName;
  }

  getEmployerId() {
    return this.getDecodeToken()?.UserId;
  }

  getUserName() {
    return this.getDecodeToken()?.UserName;
  }

  getUserId() {
    return this.getDecodeToken()?.UserId;
  }

  hasPermission(permission: string): boolean {
    const decoded = this.getDecodeToken();
    if (!decoded || !decoded['Permissions']) return false;
    return decoded['Permissions'].includes(permission[0]);
  }

  login(loginRequest: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginRequest).pipe(
      tap((response: any) => {
        // Save token in localStorage
        localStorage.setItem('token', response.result);
      })
    );
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
  }

  // Check if logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole() {
    const decoded = this.getDecodeToken();
    return decoded ? decoded['UserRole'] : null;
  }

  getBaseUserId() {
    const decoded = this.getDecodeToken();
    return decoded ? decoded['BaseUserId'] : '';
  }
}
