import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { HabitList } from './habit-list';
import { HabitService } from '../../services/habit.service';
import { HabitEntryService } from '../../services/habit-entry.service';
import { Habit } from '../../models/habit';

describe('HabitList', () => {
  let component: HabitList;
  let fixture: ComponentFixture<HabitList>;

  let loadHabitsCalls: number;
  let loadHabitEntriesCalls: number;

  const habitServiceMock = {
    habits: signal<Habit[]>([]),

    loadHabits: () => {
      loadHabitsCalls++;
    },

    addHabit: (habit: Omit<Habit, '_id'>) =>
      of({
        _id: 'habit1',
        ...habit,
      }),

    updateHabit: (id: string, habit: Omit<Habit, '_id'>) =>
      of({
        _id: id,
        ...habit,
      }),

    deleteHabit: () => of(null),
  };

  const habitEntryServiceMock = {
    habitEntries: signal([]),

    loadHabitEntries: () => {
      loadHabitEntriesCalls++;
    },
  };

  beforeEach(async () => {
    loadHabitsCalls = 0;
    loadHabitEntriesCalls = 0;

    await TestBed.configureTestingModule({
      imports: [HabitList],
      providers: [
        { provide: HabitService, useValue: habitServiceMock },
        { provide: HabitEntryService, useValue: habitEntryServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HabitList);
    component = fixture.componentInstance;
    await fixture.whenStable();

    loadHabitsCalls = 0;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not add a habit with an empty name', () => {
    component.newHabitName = '   ';

    component.addHabit();

    expect(loadHabitsCalls).toBe(0);
  });

  it('should add a habit and reset the form', () => {
    component.newHabitName = 'Joggen';
    component.newHabitType = 'positive';
    component.newHabitCategory = 'Sport';

    component.addHabit();

    expect(component.newHabitName).toBe('');
    expect(component.newHabitType).toBe('positive');
    expect(component.newHabitCategory).toBe('');
    expect(loadHabitsCalls).toBe(1);
  });

  it('should fill the form when editing a habit', () => {
    const habit: Habit = {
      _id: 'habit1',
      name: 'Joggen',
      type: 'positive',
      category: 'Sport',
    };

    component.editHabit(habit);

    expect(component.editingHabitId).toBe('habit1');
    expect(component.newHabitName).toBe('Joggen');
    expect(component.newHabitType).toBe('positive');
    expect(component.newHabitCategory).toBe('Sport');
  });

  it('should save an edited habit and reset the form', () => {
    component.editingHabitId = 'habit1';
    component.newHabitName = 'Fitness';
    component.newHabitType = 'positive';
    component.newHabitCategory = 'Gesundheit';

    component.saveHabit();

    expect(component.editingHabitId).toBeNull();
    expect(component.newHabitName).toBe('');
    expect(component.newHabitType).toBe('positive');
    expect(component.newHabitCategory).toBe('');
    expect(loadHabitsCalls).toBe(1);
  });

  it('should reload habits and entries after deleting a habit', () => {
    component.deleteHabit('habit1');

    expect(loadHabitsCalls).toBe(1);
    expect(loadHabitEntriesCalls).toBe(1);
  });
});