import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { Statistics } from './statistics';
import { HabitService } from '../../services/habit.service';
import { HabitEntryService } from '../../services/habit-entry.service';

describe('Statistics', () => {
  let component: Statistics;
  let fixture: ComponentFixture<Statistics>;

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
});
