import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { HabitList } from './habit-list';
import { HabitService } from '../../services/habit.service';
import { HabitEntryService } from '../../services/habit-entry.service';

describe('HabitList', () => {
  let component: HabitList;
  let fixture: ComponentFixture<HabitList>;

  const habitServiceMock = {
    habits: signal([]),
    loadHabits: () => {},
  };

  const habitEntryServiceMock = {
    habitEntries: signal([]),
    loadHabitEntries: () => {},
  };

  beforeEach(async () => {
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
