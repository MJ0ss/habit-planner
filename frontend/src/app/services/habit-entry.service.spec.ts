import { TestBed } from '@angular/core/testing';
import { HabitEntryService } from './habit-entry.service';

describe('HabitEntryService', () => {
  let service: HabitEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HabitEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
