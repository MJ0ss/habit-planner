import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

interface AuthResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  username = signal<string | null>(null);
  token = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  register(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  login(username: string, password: string) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password });
  }

  setSession(token: string, username: string) {
    this.token.set(token);
    this.username.set(username);
  }

  logout() {
    this.token.set(null);
    this.username.set(null);
  }

  isLoggedIn() {
    return this.token() !== null;
  }
}
