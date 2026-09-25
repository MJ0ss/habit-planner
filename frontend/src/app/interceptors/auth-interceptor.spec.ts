import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { HttpClient } from '@angular/common/http';
import { authInterceptor } from './auth-interceptor';
import { AuthService } from '../services/auth.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        AuthService,
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should add the Authorization header when a token exists', () => {
    authService.token.set('test-token');

    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');

    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');

    req.flush({});
  });

  it('should not add the Authorization header when no token exists', () => {
    authService.token.set(null);

    http.get('/api/test').subscribe();

    const req = httpTesting.expectOne('/api/test');

    expect(req.request.headers.has('Authorization')).toBe(false);

    req.flush({});
  });
});
