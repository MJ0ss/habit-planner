import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { Statistics } from './statistics';
import { HabitService } from '../../services/habit.service';
import { HabitEntryService } from '../../services/habit-entry.service';
import { Habit } from '../../models/habit';
import { HabitEntry } from '../../models/habit-entry';

describe('Statistics', () => {
  let component: Statistics;
  let fixture: ComponentFixture<Statistics>;

  const habitServiceMock = {
    habits: signal<Habit[]>([]),
    loadHabits: () => {},
  };

  const habitEntryServiceMock = {
    habitEntries: signal<HabitEntry[]>([]),
    loadHabitEntries: () => {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Statistics],
      providers: [
        { provide: HabitService, useValue: habitServiceMock },
        { provide: HabitEntryService, useValue: habitEntryServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Statistics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the success rate of a positive habit', () => {
    const habit = {
      _id: 'habit1',
      name: 'Joggen',
      type: 'positive' as const,
      category: 'Sport',
    };

    habitServiceMock.habits.set([habit]);

    habitEntryServiceMock.habitEntries.set([
      {
        _id: 'entry1',
        habitId: 'habit1',
        date: '2026-09-20',
        status: 'completed',
      },
      {
        _id: 'entry2',
        habitId: 'habit1',
        date: '2026-09-21',
        status: 'completed',
      },
      {
        _id: 'entry3',
        habitId: 'habit1',
        date: '2026-09-22',
        status: 'missed',
      },
    ]);

    expect(component.getSuccessRate(habit)).toBe(67);
  });

  it('should calculate the overall success rate and ignore planned entries', () => {
    habitEntryServiceMock.habitEntries.set([
      {
        _id: 'entry1',
        habitId: 'habit1',
        date: '2026-09-20',
        status: 'completed',
      },
      {
        _id: 'entry2',
        habitId: 'habit1',
        date: '2026-09-21',
        status: 'completed',
      },
      {
        _id: 'entry3',
        habitId: 'habit1',
        date: '2026-09-22',
        status: 'missed',
      },
      {
        _id: 'entry4',
        habitId: 'habit2',
        date: '2026-09-22',
        status: 'occurred',
      },
      {
        _id: 'entry5',
        habitId: 'habit1',
        date: '2026-09-23',
        status: 'planned',
      },
    ]);

    expect(component.getOverallSuccessRate()).toBe(50);
  });

  it('should count evaluated entries of a category', () => {
    habitServiceMock.habits.set([
      {
        _id: 'habit1',
        name: 'Joggen',
        type: 'positive',
        category: 'Sport',
      },
      {
        _id: 'habit2',
        name: 'Fitness',
        type: 'positive',
        category: 'Sport',
      },
      {
        _id: 'habit3',
        name: 'Lesen',
        type: 'positive',
        category: 'Lernen',
      },
    ]);

    habitEntryServiceMock.habitEntries.set([
      {
        _id: 'entry1',
        habitId: 'habit1',
        date: '2026-09-20',
        status: 'completed',
      },
      {
        _id: 'entry2',
        habitId: 'habit2',
        date: '2026-09-21',
        status: 'missed',
      },
      {
        _id: 'entry3',
        habitId: 'habit1',
        date: '2026-09-22',
        status: 'planned',
      },
      {
        _id: 'entry4',
        habitId: 'habit3',
        date: '2026-09-22',
        status: 'completed',
      },
    ]);

    expect(component.getCategoryCount('Sport')).toBe(2);
  });
});
