import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { Calendar } from './calendar';
import { HabitService } from '../../services/habit.service';
import { HabitEntryService } from '../../services/habit-entry.service';
import { Habit } from '../../models/habit';
import { HabitEntry } from '../../models/habit-entry';

describe('Calendar', () => {
  let component: Calendar;
  let fixture: ComponentFixture<Calendar>;

  let loadHabitEntriesCalls: number;
  let lastAddedEntry: Omit<HabitEntry, '_id'> | null;
  let lastUpdatedEntry: {
    id: string;
    update: Partial<Omit<HabitEntry, '_id'>>;
  } | null;
  let lastDeletedEntryId: string | null;

  const habitServiceMock = {
    habits: signal<Habit[]>([]),
    loadHabits: () => {},
  };

  const habitEntryServiceMock = {
    habitEntries: signal<HabitEntry[]>([]),

    loadHabitEntries: () => {
      loadHabitEntriesCalls++;
    },

    addHabitEntry: (entry: Omit<HabitEntry, '_id'>) => {
      lastAddedEntry = entry;

      return of({
        _id: 'entry1',
        ...entry,
      });
    },

    updateHabitEntry: (id: string, update: Partial<Omit<HabitEntry, '_id'>>) => {
      lastUpdatedEntry = { id, update };

      return of({
        _id: id,
        habitId: 'habit1',
        date: '2026-09-23',
        status: update.status ?? 'planned',
      });
    },

    deleteHabitEntry: (id: string) => {
      lastDeletedEntryId = id;
      return of(null);
    },
  };

  beforeEach(async () => {
    loadHabitEntriesCalls = 0;
    lastAddedEntry = null;
    lastUpdatedEntry = null;
    lastDeletedEntryId = null;

    habitServiceMock.habits.set([]);
    habitEntryServiceMock.habitEntries.set([]);

    await TestBed.configureTestingModule({
      imports: [Calendar],
      providers: [
        { provide: HabitService, useValue: habitServiceMock },
        { provide: HabitEntryService, useValue: habitEntryServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Calendar);
    component = fixture.componentInstance;
    await fixture.whenStable();

    // ngOnInit lädt bereits einmal.
    loadHabitEntriesCalls = 0;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select a day', () => {
    component.selectDay(23);

    expect(component.selectedDay()).toBe(23);
  });

  it('should return entries for the selected calendar day', () => {
    component.currentDate.set(new Date(2026, 8, 1));

    habitEntryServiceMock.habitEntries.set([
      {
        _id: 'entry1',
        habitId: 'habit1',
        date: '2026-09-23',
        status: 'completed',
      },
      {
        _id: 'entry2',
        habitId: 'habit1',
        date: '2026-09-24',
        status: 'planned',
      },
    ]);

    const entries = component.getEntriesForDay(23);

    expect(entries.length).toBe(1);
    expect(entries[0]._id).toBe('entry1');
  });

  it('should create a planned entry for a positive habit', () => {
    habitServiceMock.habits.set([
      {
        _id: 'habit1',
        name: 'Joggen',
        type: 'positive',
        category: 'Sport',
      },
    ]);

    component.currentDate.set(new Date(2026, 8, 1));
    component.selectedDay.set(23);
    component.selectedHabitId = 'habit1';

    component.planHabit();

    expect(lastAddedEntry).toEqual({
      habitId: 'habit1',
      date: '2026-09-23',
      status: 'planned',
    });

    expect(component.selectedHabitId).toBe('');
    expect(loadHabitEntriesCalls).toBe(1);
  });

  it('should create an occurred entry for a negative habit', () => {
    habitServiceMock.habits.set([
      {
        _id: 'habit2',
        name: 'Social Media',
        type: 'negative',
        category: 'Social Media',
      },
    ]);

    component.currentDate.set(new Date(2026, 8, 1));
    component.selectedDay.set(23);
    component.selectedHabitId = 'habit2';

    component.planHabit();

    expect(lastAddedEntry).toEqual({
      habitId: 'habit2',
      date: '2026-09-23',
      status: 'occurred',
    });
  });

  it('should mark a habit entry as completed', () => {
    const entry: HabitEntry = {
      _id: 'entry1',
      habitId: 'habit1',
      date: '2026-09-23',
      status: 'planned',
    };

    component.completeHabit(entry);

    expect(lastUpdatedEntry).toEqual({
      id: 'entry1',
      update: {
        status: 'completed',
      },
    });

    expect(loadHabitEntriesCalls).toBe(1);
  });

  it('should mark a habit entry as missed', () => {
    const entry: HabitEntry = {
      _id: 'entry1',
      habitId: 'habit1',
      date: '2026-09-23',
      status: 'planned',
    };

    component.missHabit(entry);

    expect(lastUpdatedEntry).toEqual({
      id: 'entry1',
      update: {
        status: 'missed',
      },
    });

    expect(loadHabitEntriesCalls).toBe(1);
  });

  it('should delete a habit entry', () => {
    const entry: HabitEntry = {
      _id: 'entry1',
      habitId: 'habit1',
      date: '2026-09-23',
      status: 'planned',
    };

    component.deleteHabitEntry(entry);

    expect(lastDeletedEntryId).toBe('entry1');
    expect(loadHabitEntriesCalls).toBe(1);
  });

  it('should navigate to the next month and clear the selection', () => {
    component.currentDate.set(new Date(2026, 8, 1));
    component.selectedDay.set(23);
    component.selectedHabitId = 'habit1';

    component.nextMonth();

    expect(component.currentDate().getFullYear()).toBe(2026);
    expect(component.currentDate().getMonth()).toBe(9);
    expect(component.selectedDay()).toBeNull();
    expect(component.selectedHabitId).toBe('');
  });
});
