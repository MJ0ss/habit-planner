import { Component, inject, OnInit, signal } from '@angular/core';

import { Habit } from '../../models/habit';
import { HabitEntry } from '../../models/habit-entry';
import { HabitService } from '../../services/habit.service';
import { HabitEntryService } from '../../services/habit-entry.service';

@Component({
  selector: 'app-statistics',
  imports: [],
  templateUrl: './statistics.html',
  styleUrl: './statistics.css',
})
export class Statistics implements OnInit {
  private habitService = inject(HabitService);
  private habitEntryService = inject(HabitEntryService);

  habits = this.habitService.habits;
  habitEntries = this.habitEntryService.habitEntries;

  ngOnInit() {
    this.habitService.loadHabits();
    this.loadHabitEntries();
  }

  loadHabitEntries() {
    this.habitEntryService.loadHabitEntries();
  }

  getPlannedCount(habit: Habit) {
    return this.habitEntries().filter(
      (entry) => entry.habitId === habit._id && entry.status === 'planned',
    ).length;
  }

  getCompletedCount(habit: Habit) {
    return this.habitEntries().filter(
      (entry) => entry.habitId === habit._id && entry.status === 'completed',
    ).length;
  }

  getMissedCount(habit: Habit) {
    return this.habitEntries().filter(
      (entry) => entry.habitId === habit._id && entry.status === 'missed',
    ).length;
  }

  getOccurredCount(habit: Habit) {
    return this.habitEntries().filter(
      (entry) => entry.habitId === habit._id && entry.status === 'occurred',
    ).length;
  }

  getSuccessRate(habit: Habit) {
    const completed = this.getCompletedCount(habit);
    const missed = this.getMissedCount(habit);

    const total = completed + missed;

    if (total === 0) {
      return 0;
    }

    return Math.round((completed / total) * 100);
  }

  getOverallSuccessRate() {
    const relevantEntries = this.habitEntries().filter(
      (entry) =>
        entry.status === 'completed' || entry.status === 'missed' || entry.status === 'occurred',
    );

    if (relevantEntries.length === 0) {
      return 0;
    }

    const completedEntries = relevantEntries.filter((entry) => entry.status === 'completed').length;

    return Math.round((completedEntries / relevantEntries.length) * 100);
  }

  getCategoryCount(category: string) {
    const habitIds = this.habits()
      .filter((habit) => habit.category === category)
      .map((habit) => habit._id);

    return this.habitEntries().filter(
      (entry) =>
        habitIds.includes(entry.habitId) &&
        (entry.status === 'completed' || entry.status === 'missed' || entry.status === 'occurred'),
    ).length;
  }

  getTrackedCategories() {
    const categories = this.habits()
      .map((habit) => habit.category)
      .filter((category) => category);

    const uniqueCategories = [...new Set(categories)];

    return uniqueCategories.filter((category) => this.getCategoryCount(category) > 0);
  }

  hasPositiveHabitEntries() {
    return this.habits().some(
      (habit) =>
        habit.type === 'positive' &&
        (this.getPlannedCount(habit) > 0 ||
          this.getCompletedCount(habit) > 0 ||
          this.getMissedCount(habit) > 0),
    );
  }

  hasOccurredNegativeHabits() {
    return this.habits().some(
      (habit) => habit.type === 'negative' && this.getOccurredCount(habit) > 0,
    );
  }
}
