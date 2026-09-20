import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HabitEntry } from '../models/habit-entry';

@Injectable({
  providedIn: 'root',
})
export class HabitEntryService {
  private apiUrl = 'http://localhost:3000/api/habit-entries';

  constructor(private http: HttpClient) {}

  getHabitEntries() {
    return this.http.get<HabitEntry[]>(this.apiUrl);
  }

  addHabitEntry(habitEntry: Omit<HabitEntry, '_id'>) {
    return this.http.post<HabitEntry>(this.apiUrl, habitEntry);
  }

  updateHabitEntry(id: string, habitEntry: Partial<Omit<HabitEntry, '_id'>>) {
    return this.http.put<HabitEntry>(
      `${this.apiUrl}/${id}`,
      habitEntry
    );
  }

  deleteHabitEntry(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}