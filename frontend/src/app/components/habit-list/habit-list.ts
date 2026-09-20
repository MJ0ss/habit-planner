import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { HabitService } from '../../services/habit.service';

@Component({
  imports: [],
  selector: 'app-habit-list',
  styleUrl: './habit-list.css',
  templateUrl: './habit-list.html',
})

export class HabitList {
  private habitService = inject(HabitService);

  habits = toSignal(this.habitService.getHabits(), {
    initialValue: []
  });
}
