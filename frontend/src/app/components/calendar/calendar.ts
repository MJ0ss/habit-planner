import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HabitEntry } from '../../models/habit-entry';
import { HabitEntryService } from '../../services/habit-entry.service';
import { Habit } from '../../models/habit';
import { HabitService } from '../../services/habit.service';

@Component({
  selector: 'app-calendar',
  imports: [FormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar implements OnInit {
  private habitEntryService = inject(HabitEntryService);
  private habitService = inject(HabitService);

  habitEntries = this.habitEntryService.habitEntries;
  habits = this.habitService.habits;

  currentDate = signal(new Date());
  weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  selectedDay = signal<number | null>(null);
  selectedHabitId = '';

  ngOnInit() {
    this.loadHabitEntries();
    this.loadHabits();
  }

  get monthName() {
    return this.currentDate().toLocaleDateString('de-CH', {
      month: 'long',
      year: 'numeric'
    });
  }

  get daysInMonth() {
    const date = this.currentDate();

    const year = date.getFullYear();
    const month = date.getMonth();

    const numberOfDays = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: numberOfDays }, (_, index) => index + 1);
  }

  get firstDayOffset() {
    const date = this.currentDate();

    const firstDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay();

    return (firstDay + 6) % 7;
  }

  loadHabitEntries() {
    this.habitEntryService.loadHabitEntries();
  }

  loadHabits() {
    this.habitService.loadHabits();
  }

  getEntriesForDay(day: number) {
    const date = this.currentDate();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayString = String(day).padStart(2, '0');

    const dateString = `${year}-${month}-${dayString}`;

    return this.habitEntries().filter(
      (entry) => entry.date === dateString
    );
  }

  getHabitName(habitId: string) {
      const habit = this.habits().find(
        (habit) => habit._id === habitId
      );

      return habit?.name ?? 'Unbekannter Habit';
    }

    selectDay(day: number) {
      this.selectedDay.set(day);
    }

  getSelectedHabit() {
    return this.habits().find(
      (habit) => habit._id === this.selectedHabitId
    );
  }  

  planHabit() {
    const day = this.selectedDay();

    if (!day || !this.selectedHabitId) {
      return;
    }

    const habit = this.habits().find(
      (habit) => habit._id === this.selectedHabitId
    );

    if (!habit) {
      return;
    }

    const date = this.currentDate();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayString = String(day).padStart(2, '0');

    const dateString = `${year}-${month}-${dayString}`;

    this.habitEntryService.addHabitEntry({
      habitId: this.selectedHabitId,
      date: dateString,
      status: habit.type === 'positive' ? 'planned' : 'occurred'
    }).subscribe(() => {
      this.selectedHabitId = '';
      this.loadHabitEntries();
    });
  }

  completeHabit(entry: HabitEntry) {
    this.habitEntryService.updateHabitEntry(entry._id, {
      status: 'completed'
    }).subscribe(() => {
      this.loadHabitEntries();
    });
  }

  missHabit(entry: HabitEntry) {
    this.habitEntryService.updateHabitEntry(entry._id, {
      status: 'missed'
    }).subscribe(() => {
      this.loadHabitEntries();
    });
  }

  deleteHabitEntry(entry: HabitEntry) {
    this.habitEntryService.deleteHabitEntry(entry._id).subscribe(() => {
      this.loadHabitEntries();
    });
  }

  previousMonth() {
    const date = this.currentDate();

    this.currentDate.set(
      new Date(date.getFullYear(), date.getMonth() - 1, 1)
    );

    this.selectedDay.set(null);
    this.selectedHabitId = '';
  }

  nextMonth() {
    const date = this.currentDate();

    this.currentDate.set(
      new Date(date.getFullYear(), date.getMonth() + 1, 1)
    );

    this.selectedDay.set(null);
    this.selectedHabitId = '';
  }

  goToCurrentMonth() {
    this.currentDate.set(new Date());
    this.selectedDay.set(null);
    this.selectedHabitId = '';
  }

  isToday(day: number) {
    const today = new Date();
    const current = this.currentDate();

    return (
      day === today.getDate() &&
      current.getMonth() === today.getMonth() &&
      current.getFullYear() === today.getFullYear()
    );
  }
}