import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="sidebar-backdrop d-lg-none" 
         [class.show]="isOpen()" 
         (click)="close()"></div>

    <div class="d-flex flex-column flex-shrink-0 p-3 text-white bg-primary sidebar" 
         [class.open]="isOpen()">
      
      <div class="d-flex align-items-center justify-content-between mb-2">
        <div class="d-flex align-items-center text-white text-decoration-none">
          <span class="fs-2 me-2">📖</span>
          <span class="fs-3 fw-bold">Biblioteca</span>
        </div>
        <button class="btn btn-sm btn-outline-light d-lg-none" (click)="close()">✕</button>
      </div>

      @if (authService.isAuthenticated()) {
        <div class="user-info-top p-3 mb-3 rounded bg-primary-darker animate-fade-in">
          <div class="fw-semibold text-truncate fs-6"> Hola, {{ authService.currentUser()?.username }}
          </div>
          <span class="badge mt-2 py-1 px-2" 
                [ngClass]="{
                  'bg-warning text-dark': authService.currentUser()?.role === 'Administrador',
                  'bg-info text-dark': authService.currentUser()?.role === 'Estudiante'
                }" style="font-size: 0.75rem;"> {{ authService.currentUser()?.role | uppercase }}
          </span>
        </div>
      }
      
      <hr class="opacity-50 mt-0">
      
      <ul class="nav nav-pills flex-column nav-scrollable custom-scroll">
        
        @if (authService.isAuthenticated()) {
          <li class="nav-item mb-1 mt-2"> <span class="text-uppercase text-white-50 fw-bold ms-1 category-title">General</span>
          </li>
          <li class="nav-item">
            <a routerLink="/books" class="nav-link d-flex align-items-center" 
               routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="close()">
               <span class="me-3 icon-size-sm">📚</span> Catálogo
            </a>
          </li>
          <li>
            <a routerLink="/buscar" class="nav-link d-flex align-items-center" 
               routerLinkActive="active" (click)="close()">
               <span class="me-3 icon-size-sm">🔎</span> Buscador
            </a>
          </li>
          <li>
            <a routerLink="/mis-prestamos" class="nav-link d-flex align-items-center" 
               routerLinkActive="active" (click)="close()">
               <span class="me-3 icon-size-sm">📂</span> Mis Préstamos
            </a>
          </li>

          @if (authService.isAdmin()) {
            <li class="nav-item mt-3 mb-1"> <span class="text-uppercase text-warning fw-bold ms-1 category-title">Administración</span>
            </li>
            <li>
              <a routerLink="/admin/libros/nuevo" class="nav-link d-flex align-items-center" 
                 routerLinkActive="active" (click)="close()">
                 <span class="me-3 icon-size-sm">➕</span> Nuevo Libro
              </a>
            </li>
            <li>
              <a routerLink="/admin/prestamos/nuevo" class="nav-link d-flex align-items-center" 
                 routerLinkActive="active" (click)="close()">
                 <span class="me-3 icon-size-sm">📝</span> Asignar Préstamo
              </a>
            </li>
            <li>
              <a routerLink="/admin/usuarios" class="nav-link d-flex align-items-center" 
                 routerLinkActive="active" (click)="close()">
                 <span class="me-3 icon-size-sm">👥</span> Usuarios
              </a>
            </li>
          }
        } @else {
           <li class="nav-item mb-1 mt-2">
            <span class="text-uppercase text-white-50 fw-bold ms-1 category-title">Bienvenido</span>
          </li>
           <li class="nav-item">
            <a routerLink="/login" class="nav-link d-flex align-items-center py-2" 
               routerLinkActive="active" (click)="close()">
               <span class="me-3 icon-size-sm">🔐</span> Iniciar Sesión
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/register" class="nav-link d-flex align-items-center py-2" 
               routerLinkActive="active" (click)="close()">
               <span class="me-3 icon-size-sm">📝</span> Registrarse
            </a>
          </li>
        }

      </ul>
      
      <div class="flex-grow-1"></div>

      @if (authService.isAuthenticated()) {
        <div class="mt-3 pt-3 border-top border-white border-opacity-25">
          <button class="btn btn-danger w-100 py-2 fw-semibold d-flex align-items-center justify-content-center logout-btn" 
                  (click)="logout()" title="Cerrar Sesión">
            <span class="me-2 fs-5">🚪</span> Cerrar Sesión
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .sidebar {
      width: 240px; /* Reducimos el ancho de 280px a 240px */
      height: 100vh; position: fixed; top: 0; left: 0; z-index: 1040;
      transition: transform 0.3s ease-in-out;
      box-shadow: 4px 0 15px rgba(0,0,0,0.15);
      background-image: linear-gradient(180deg, var(--bs-primary) 0%, #0a58ca 100%);
    }

    /* --- ESTILOS DE NAVEGACIÓN COMPACTOS --- */
    .nav-pills .nav-link {
      font-size: 1rem; /* Reducido de 1.05rem */
      padding: 0.6rem 1rem; /* Padding vertical más pequeño */
      border-radius: 8px; /* Bordes menos redondeados */
      margin-bottom: 4px; /* Margen más pequeño entre botones */
      font-weight: 500; transition: all 0.25s ease;
      background-color: rgba(0, 0, 0, 0.15); color: rgba(255, 255, 255, 0.85); border: 1px solid rgba(255,255,255,0.05);

      &:hover {
        background-color: rgba(255, 255, 255, 0.25); color: #fff;
        transform: translateX(3px); /* Movimiento más sutil */
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      }
      &.active {
        background-color: #fff !important; color: var(--bs-primary) !important; font-weight: 700;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }
    }

    /* Iconos más pequeños para un look más compacto */
    .icon-size-sm { font-size: 1.2rem; } /* Antes 1.4rem */
    .category-title { font-size: 0.75rem; letter-spacing: 1.5px; opacity: 0.8; } /* Título de categoría más pequeño */
    
    /* --- Otros estilos se mantienen --- */
    .nav-scrollable { overflow-y: auto; overflow-x: hidden; padding: 2px 0; }
    .nav-pills .nav-item:last-child .nav-link { margin-bottom: 0 !important; }
    .logout-btn { transition: all 0.2s; &:hover { transform: scale(1.02); box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3); } }
    .bg-primary-darker { background-color: rgba(0, 0, 0, 0.25); }
    .animate-fade-in { animation: fadeIn 0.5s ease-in; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    .custom-scroll::-webkit-scrollbar { width: 4px; }
    .custom-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
    .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }

    /* --- 🟢 CLAVE: Ajuste Responsivo en App Component 🟢 --- */
    /* Aseguramos que el contenido principal se desplace 240px en escritorio */
    @media (min-width: 992px) {
      .sidebar { width: 240px; } /* Lo forzamos aquí también si es necesario */
    }

    @media (max-width: 991.98px) {
      .sidebar { transform: translateX(-100%); width: 240px; }
      .sidebar.open { transform: translateX(0); }
      .sidebar-backdrop {
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0,0,0,0.5); z-index: 1039; opacity: 0; visibility: hidden; transition: all 0.3s;
        &.show { opacity: 1; visibility: visible; }
      }
    }
  `]
})
export class SidebarComponent {
  public authService = inject(AuthService);
  private router = inject(Router);
  public isOpen = signal(false);

  toggle() { this.isOpen.update(v => !v); }
  close() { this.isOpen.set(false); }
  open() { this.isOpen.set(true); }
  logout() {
    this.close();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}