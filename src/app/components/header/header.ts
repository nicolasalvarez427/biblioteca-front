import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-3">
      <div class="container-fluid">
        <!-- Logo -->
        <a class="navbar-brand fw-bold d-flex align-items-center" routerLink="/books">
          <span class="fs-4 me-2">📚</span> Biblioteca App
        </a>

        <!-- Menú centrado -->
        <div class="collapse navbar-collapse justify-content-center">
          @if (authService.isAuthenticated()) {
            <ul class="navbar-nav">
              <li class="nav-item mx-2">
                <a 
                  routerLink="/books" 
                  class="nav-link text-light"
                  routerLinkActive="fw-bold text-decoration-underline">
                  Lista de Libros
                </a>
              </li>
              <li class="nav-item mx-2">
                <a 
                  routerLink="/mis-prestamos" 
                  class="nav-link text-light"
                  routerLinkActive="fw-bold text-decoration-underline">
                  Historial de Préstamos
                </a>
              </li>

              <!-- 🔹 Opciones visibles solo para administradores -->
              @if (authService.isAdmin()) {
                <li class="nav-item mx-2">
                  <a 
                    routerLink="/crear-libro" 
                    class="nav-link text-light"
                    routerLinkActive="fw-bold text-decoration-underline">
                    ➕ Agregar Libro
                  </a>
                </li>
                <li class="nav-item mx-2">
                  <a 
                    routerLink="/admin/usuarios" 
                    class="nav-link text-light"
                    routerLinkActive="fw-bold text-decoration-underline">
                    👥 Lista de Usuarios
                  </a>
                </li>
              }
            </ul>
          }
        </div>

        <!-- Zona derecha -->
        <div class="d-flex align-items-center ms-auto">
          @if (authService.isAuthenticated()) {
            <div class="text-light me-3 d-none d-sm-flex align-items-center border-start ps-3">
              <span 
                class="badge me-2 fw-semibold px-2 py-1 rounded-pill"
                [ngClass]="{
                  'bg-warning text-dark': authService.currentUser()?.role === 'Administrador',
                  'bg-info text-dark': authService.currentUser()?.role === 'Estudiante'
                }">
                {{ authService.currentUser()?.role }}
              </span>
              <span>{{ authService.currentUser()?.username }}</span>
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
    .navbar { z-index: 1030; }
    .nav-link { cursor: pointer; transition: opacity 0.2s; }
    .nav-link:hover { opacity: 0.8; }
    .navbar-nav .nav-link.active {
      font-weight: bold;
      text-decoration: underline;
    }
    .badge {
      font-size: 0.75rem;
      letter-spacing: 0.3px;
    }
  `]
})
export class HeaderComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
