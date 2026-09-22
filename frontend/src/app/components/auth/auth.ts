import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  imports: [FormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  private authService = inject(AuthService);
  auth = this.authService;

  username = '';
  password = '';
  message = '';

  register() {
    this.authService.register(this.username, this.password).subscribe({
      next: () => {
        this.message = 'Registrierung erfolgreich';
      },
      error: (error) => {
        this.message =
          error.error?.message ?? 'Registrierung fehlgeschlagen';
      },
    });
  }

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.authService.setSession(
          response.token,
          response.username
        );

        this.message = `Willkommen ${response.username}`;
        this.password = '';
      },
      error: (error) => {
        this.message =
          error.error?.message ?? 'Login fehlgeschlagen';
      },
    });
  }

  logout() {
    this.authService.logout();
    this.username = '';
    this.password = '';
    this.message = '';
  }
}