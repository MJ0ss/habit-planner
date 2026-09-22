import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { Calendar } from './calendar';
import { HabitService } from '../../services/habit.service';
import { HabitEntryService } from '../../services/habit-entry.service';

describe('Calendar', () => {
  let component: Calendar;
  let fixture: ComponentFixture<Calendar>;

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
      imports: [Calendar],
      providers: [
        { provide: HabitService, useValue: habitServiceMock },
        { provide: HabitEntryService, useValue: habitEntryServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Calendar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
