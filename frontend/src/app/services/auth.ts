import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  // Login dan mendapatkan token
  login(credentials: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({});
    return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials, {headers, withCredentials: true}).pipe(
      tap(response => {
        // Simpan token di localStorage
        if (response && response.token) {
          this.setToken(response.token);
          localStorage.setItem('user', response.alias);
        }
      })
    );
  }

  // Set token di localStorage
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Mengambil token dari localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Menghapus token dari localStorage
  logout(): void {
    localStorage.clear();
  }

  // Mengecek apakah user sudah login
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}