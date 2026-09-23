import { TestBed } from '@angular/core/testing';
import { provideHttpClient, } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController,} from '@angular/common/http/testing';

import { HabitService } from './habit.service';

describe('HabitService', () => {
  let service: HabitService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(HabitService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request when adding a habit', () => {
    const newHabit = {
      name: 'Joggen',
      type: 'positive' as const,
      category: 'Sport',
    };

    service.addHabit(newHabit).subscribe();

    const req = httpTesting.expectOne(
      'http://localhost:3000/api/habits'
    );

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newHabit);

    req.flush({
      _id: 'habit1',
      ...newHabit,
    });
  });

  it('should send a PUT request when updating a habit', () => {
  const updatedHabit = {
    name: 'Joggen',
    type: 'positive' as const,
    category: 'Gesundheit',
  };

  service.updateHabit('habit1', updatedHabit).subscribe();

  const req = httpTesting.expectOne(
    'http://localhost:3000/api/habits/habit1'
  );

  expect(req.request.method).toBe('PUT');
  expect(req.request.body).toEqual(updatedHabit);

  req.flush({
    _id: 'habit1',
    ...updatedHabit,
  });
});

it('should send a DELETE request when deleting a habit', () => {
  service.deleteHabit('habit1').subscribe();

  const req = httpTesting.expectOne(
    'http://localhost:3000/api/habits/habit1'
  );

  expect(req.request.method).toBe('DELETE');

  req.flush(null);
});
});