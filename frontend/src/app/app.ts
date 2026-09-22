import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Auth } from './components/auth/auth';
import { HabitList } from './components/habit-list/habit-list';
import { Calendar } from './components/calendar/calendar';
import { Statistics } from './components/statistics/statistics';

import { AuthService } from './services/auth.service';

@Component({
  imports: [Auth, RouterOutlet, HabitList, Calendar, Statistics],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');

  auth = inject(AuthService);
}
