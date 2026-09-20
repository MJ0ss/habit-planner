import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

import { Habit } from '../models/habit';

@Injectable({
  providedIn: 'root',
})
export class HabitService {
  private apiUrl = 'http://localhost:3000/api/habits';

  habits = signal<Habit[]>([]);

  constructor(private http: HttpClient) {}

  getHabits() {
    return this.http.get<Habit[]>(this.apiUrl);
  }

  loadHabits() {
    this.http.get<Habit[]>(this.apiUrl).subscribe((habits) => {
      this.habits.set(habits);
    });
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