import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/">
          📚 Biblioteca App
        </a>

        <div class="d-flex align-items-center">
          @if (authService.isAuthenticated()) {
            <span class="text-light me-3 d-none d-md-block">
              Hola, {{ authService.currentUser()?.username }}
            </span>
            <button class="btn btn-outline-light btn-sm" (click)="logout()">
              Cerrar Sesión
            </button>
          } @else {
            <a routerLink="/login" class="btn btn-sm btn-light me-2">Ingresar</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      z-index: 1030; /* Asegura que quede por encima de otros elementos si es necesario */
    }
  `]
})
export class HeaderComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}