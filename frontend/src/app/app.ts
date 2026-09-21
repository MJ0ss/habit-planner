import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HabitList } from './components/habit-list/habit-list';
import { Calendar } from './components/calendar/calendar';
import { Statistics } from './components/statistics/statistics';

@Component({
  imports: [RouterOutlet, HabitList, Calendar, Statistics],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
