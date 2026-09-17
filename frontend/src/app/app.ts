import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HabitList } from './components/habit-list/habit-list';

@Component({
  imports: [RouterOutlet, HabitList],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend');
}
