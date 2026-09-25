import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request when registering', () => {
    service.register('michi', 'test123').subscribe();

    const req = httpTesting.expectOne('http://localhost:3000/api/register');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'michi',
      password: 'test123',
    });

    req.flush({
      _id: 'user1',
      username: 'michi',
    });
  });

  it('should send a POST request when logging in', () => {
    service.login('michi', 'test123').subscribe();

    const req = httpTesting.expectOne('http://localhost:3000/api/login');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'michi',
      password: 'test123',
    });

    req.flush({
      token: 'test-token',
      username: 'michi',
    });
  });

  it('should store token and username when setting a session', () => {
    service.setSession('test-token', 'michi');

    expect(service.token()).toBe('test-token');
    expect(service.username()).toBe('michi');
  });

  it('should clear token and username when logging out', () => {
    service.setSession('test-token', 'michi');

    service.logout();

    expect(service.token()).toBeNull();
    expect(service.username()).toBeNull();
  });

  it('should return the correct login state', () => {
    expect(service.isLoggedIn()).toBe(false);

    service.setSession('test-token', 'michi');

    expect(service.isLoggedIn()).toBe(true);

    service.logout();

    expect(service.isLoggedIn()).toBe(false);
  });
});
