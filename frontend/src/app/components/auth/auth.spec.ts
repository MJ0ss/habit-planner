import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

import { Auth } from './auth';
import { AuthService } from '../../services/auth.service';

describe('Auth', () => {
  let component: Auth;
  let fixture: ComponentFixture<Auth>;

  let sessionToken: string | null;
  let sessionUsername: string | null;
  let logoutCalls: number;

  const authServiceMock = {
    username: signal<string | null>(null),
    token: signal<string | null>(null),

    register: () => of({}),

    login: () =>
      of({
        token: 'test-token',
        username: 'michi',
      }),

    setSession: (token: string, username: string) => {
      sessionToken = token;
      sessionUsername = username;
    },

    logout: () => {
      logoutCalls++;
    },

    isLoggedIn: () => false,
  };

  beforeEach(async () => {
    sessionToken = null;
    sessionUsername = null;
    logoutCalls = 0;

    await TestBed.configureTestingModule({
      imports: [Auth],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Auth);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show a success message after registration', () => {
    component.username = 'michi';
    component.password = 'test123';

    component.register();

    expect(component.message).toBe('Registrierung erfolgreich');
  });

  it('should show an error message when registration fails', () => {
    authServiceMock.register = () =>
      throwError(() => ({
        error: {
          message: 'Benutzername bereits vergeben',
        },
      }));

    component.register();

    expect(component.message).toBe('Benutzername bereits vergeben');
  });

  it('should set the session after successful login', () => {
    component.username = 'michi';
    component.password = 'test123';

    component.login();

    expect(sessionToken).toBe('test-token');
    expect(sessionUsername).toBe('michi');
    expect(component.message).toBe('Willkommen michi');
    expect(component.password).toBe('');
  });

  it('should show an error message when login fails', () => {
    authServiceMock.login = () =>
      throwError(() => ({
        error: {
          message: 'Benutzername oder Passwort falsch',
        },
      }));

    component.login();

    expect(component.message).toBe(
      'Benutzername oder Passwort falsch'
    );
  });

  it('should clear the form when logging out', () => {
    component.username = 'michi';
    component.password = 'test123';
    component.message = 'Willkommen michi';

    component.logout();

    expect(logoutCalls).toBe(1);
    expect(component.username).toBe('');
    expect(component.password).toBe('');
    expect(component.message).toBe('');
  });
});