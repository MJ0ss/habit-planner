import { TestBed } from '@angular/core/testing';
import { provideHttpClient,} from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController,} from '@angular/common/http/testing';

import { HabitEntryService } from './habit-entry.service';

describe('HabitEntryService', () => {
  let service: HabitEntryService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(HabitEntryService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load habit entries', () => {
    const entries = [
      {
        _id: 'entry1',
        habitId: 'habit1',
        date: '2026-09-23',
        status: 'completed' as const,
      },
    ];

    service.loadHabitEntries();

    const req = httpTesting.expectOne(
      'http://localhost:3000/api/habit-entries'
    );

    expect(req.request.method).toBe('GET');

    req.flush(entries);

    expect(service.habitEntries()).toEqual(entries);
  });

  it('should send a POST request when adding a habit entry', () => {
    const newEntry = {
      habitId: 'habit1',
      date: '2026-09-23',
      status: 'planned' as const,
    };

    service.addHabitEntry(newEntry).subscribe();

    const req = httpTesting.expectOne(
      'http://localhost:3000/api/habit-entries'
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newEntry);

    req.flush({
      _id: 'entry1',
      ...newEntry,
    });
  });

  it('should send a PUT request when updating a habit entry', () => {
    const update = {
      status: 'completed' as const,
    };

    service.updateHabitEntry('entry1', update).subscribe();

    const req = httpTesting.expectOne(
      'http://localhost:3000/api/habit-entries/entry1'
    );

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(update);

    req.flush({
      _id: 'entry1',
      habitId: 'habit1',
      date: '2026-09-23',
      status: 'completed',
    });
  });

  it('should send a DELETE request when deleting a habit entry', () => {
    service.deleteHabitEntry('entry1').subscribe();

    const req = httpTesting.expectOne(
      'http://localhost:3000/api/habit-entries/entry1'
    );

    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});