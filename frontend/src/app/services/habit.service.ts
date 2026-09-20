import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Habit } from '../models/habit';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private apiUrl = 'http://localhost:3000/api/habits';

  constructor(private http: HttpClient) {}

  getHabits() {
    return this.http.get<Habit[]>(this.apiUrl);
  }

  addHabit(habit: Omit<Habit, '_id'>) {
    return this.http.post<Habit>(this.apiUrl, habit);
  }

  updateHabit(id: string, habit: Omit<Habit, '_id'>) {
    return this.http.put<Habit>(`${this.apiUrl}/${id}`, habit);
  }

  deleteHabit(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}