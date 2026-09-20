import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HabitService } from '../../services/habit.service';
import { Habit } from '../../models/habit';

@Component({
  imports: [FormsModule],
  selector: 'app-habit-list',
  styleUrl: './habit-list.css',
  templateUrl: './habit-list.html',
})

export class HabitList implements OnInit {
  private habitService = inject(HabitService);

  habits = signal<Habit[]>([]);

  newHabitName = '';
  newHabitType: 'positive' | 'negative' = 'positive';

  ngOnInit() {
    this.loadHabits();
  } 

  loadHabits() {
    this.habitService.getHabits().subscribe((habits) => {
      this.habits.set(habits);
    });
  }

  addHabit() {
    if (!this.newHabitName.trim()) {
      return;
    }

    this.habitService.addHabit({
      name: this.newHabitName,
      type: this.newHabitType
    }).subscribe(() => {
      this.newHabitName = '';
      this.newHabitType = 'positive';

      this.loadHabits();
    })
  }
}
