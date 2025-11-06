import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar navbar-expand navbar-dark bg-primary shadow-sm px-3">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold d-flex align-items-center" routerLink="/books">
          <span class="fs-4 me-2">📚</span> Biblioteca App
        </a>

        <div class="d-flex align-items-center ms-auto">
          @if (authService.isAuthenticated()) {
            <div class="text-light me-3 d-none d-sm-block">
              Hola, <span class="fw-bold">{{ authService.currentUser()?.username }}</span>
            </div>
            <button class="btn btn-danger btn-sm fw-semibold" (click)="logout()">
              Cerrar Sesión
            </button>
          } @else {
            <a routerLink="/login" class="btn btn-outline-light btn-sm fw-semibold">Ingresar</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    /* Asegura que el header quede por encima de otros elementos al hacer scroll */
    .navbar {
      z-index: 1030;
      position: relative;
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