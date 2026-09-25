import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

import { HabitEntry } from '../models/habit-entry';

@Injectable({
  providedIn: 'root',
})
export class HabitEntryService {
  private apiUrl = 'http://localhost:3000/api/habit-entries';

  habitEntries = signal<HabitEntry[]>([]);

  constructor(private http: HttpClient) {}

  loadHabitEntries() {
    this.http.get<HabitEntry[]>(this.apiUrl).subscribe((habitEntries) => {
      this.habitEntries.set(habitEntries);
    });
  }

  getHabitEntries() {
    return this.http.get<HabitEntry[]>(this.apiUrl);
  }

  addHabitEntry(habitEntry: Omit<HabitEntry, '_id'>) {
    return this.http.post<HabitEntry>(this.apiUrl, habitEntry);
  }

  updateHabitEntry(id: string, habitEntry: Partial<Omit<HabitEntry, '_id'>>) {
    return this.http.put<HabitEntry>(`${this.apiUrl}/${id}`, habitEntry);
  }

  deleteHabitEntry(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
