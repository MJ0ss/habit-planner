import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Habit {
  private apiUrl = 'http://localhost:3000/api/habits';

  constructor(private http: HttpClient) {}

  getHabits() {
    return this.http.get(this.apiUrl);
  }
}