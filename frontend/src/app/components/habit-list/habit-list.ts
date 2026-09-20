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

  habits = this.habitService.habits;

  newHabitName = '';
  newHabitType: 'positive' | 'negative' = 'positive';

  editingHabitId: string | null = null;

  ngOnInit() {
    this.loadHabits();
  } 

  loadHabits() {
    this.habitService.loadHabits();
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

  editHabit(habit: Habit) {
    this.editingHabitId = habit._id;
    this.newHabitName = habit.name;
    this.newHabitType = habit.type;
  }

  saveHabit() {
    if (!this.editingHabitId || !this.newHabitName.trim()) {
      return;
    }

    this.habitService.updateHabit(this.editingHabitId, {
      name: this.newHabitName,
      type: this.newHabitType
    }).subscribe(() => {
      this.editingHabitId = null;
      this.newHabitName = '';
      this.newHabitType = 'positive';

      this.loadHabits();
    });
  }

  deleteHabit(id: string) {
    this.habitService.deleteHabit(id).subscribe(() => {
      this.loadHabits();
    });
  }
}
