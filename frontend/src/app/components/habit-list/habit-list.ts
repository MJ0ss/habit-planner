import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { Habit } from '../../services/habit';

@Component({
  imports: [],
  selector: 'app-habit-list',
  styleUrl: './habit-list.css',
  templateUrl: './habit-list.html',
})

export class HabitList {
  private habitService = inject(Habit);

  habits = toSignal(this.habitService.getHabits(), {
    initialValue: [] as any[]
  });
}
