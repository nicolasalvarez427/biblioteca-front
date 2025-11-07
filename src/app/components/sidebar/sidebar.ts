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
          <div class="fw-semibold text-truncate fs-5">
            Hola, {{ authService.currentUser()?.username }}
          </div>
          <span class="badge mt-2 py-2 px-3" 
                [ngClass]="{
                  'bg-warning text-dark': authService.currentUser()?.role === 'Administrador',
                  'bg-info text-dark': authService.currentUser()?.role === 'Estudiante'
                }" style="font-size: 0.85rem;">
            {{ authService.currentUser()?.role | uppercase }}
          </span>
        </div>
      }
      
      <hr class="opacity-50 mt-0">
      
      <ul class="nav nav-pills flex-column mb-auto nav-scrollable custom-scroll">
        
        @if (authService.isAuthenticated()) {
          <li class="nav-item mb-2 mt-2">
            <span class="text-uppercase text-white-50 fw-bold ms-1 category-title">General</span>
          </li>
          <li class="nav-item">
            <a routerLink="/books" class="nav-link d-flex align-items-center" 
               routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="close()">
               <span class="me-3 icon-size">📚</span> Catálogo
            </a>
          </li>
          <li>
            <a routerLink="/buscar" class="nav-link d-flex align-items-center" 
               routerLinkActive="active" (click)="close()">
               <span class="me-3 icon-size">🔎</span> Buscador
            </a>
          </li>
          <li>
            <a routerLink="/mis-prestamos" class="nav-link d-flex align-items-center" 
               routerLinkActive="active" (click)="close()">
               <span class="me-3 icon-size">📂</span> Mis Préstamos
            </a>
          </li>

          @if (authService.isAdmin()) {
            <li class="nav-item mt-4 mb-2">
              <span class="text-uppercase text-warning fw-bold ms-1 category-title">Administración</span>
            </li>
            <li>
              <a routerLink="/admin/libros/nuevo" class="nav-link d-flex align-items-center" 
                 routerLinkActive="active" (click)="close()">
                 <span class="me-3 icon-size">➕</span> Nuevo Libro
              </a>
            </li>
            <li>
              <a routerLink="/admin/prestamos/nuevo" class="nav-link d-flex align-items-center" 
                 routerLinkActive="active" (click)="close()">
                 <span class="me-3 icon-size">📝</span> Asignar Préstamo
              </a>
            </li>
            <li>
              <a routerLink="/admin/usuarios" class="nav-link d-flex align-items-center" 
                 routerLinkActive="active" (click)="close()">
                 <span class="me-3 icon-size">👥</span> Usuarios
              </a>
            </li>
          }
        } @else {
           <li class="mt-3">
            <a routerLink="/login" class="nav-link d-flex align-items-center justify-content-center fw-bold py-3 login-link" 
               routerLinkActive="active" (click)="close()">
               <span class="me-2 fs-4">🔐</span> Iniciar Sesión
            </a>
          </li>
        }

      </ul>
      
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
      width: 280px; height: 100vh; position: fixed; top: 0; left: 0; z-index: 1040;
      transition: transform 0.3s ease-in-out;
      box-shadow: 4px 0 15px rgba(0,0,0,0.15);
      background-image: linear-gradient(180deg, var(--bs-primary) 0%, #0a58ca 100%);
    }

    /* 🟢 NUEVA CLASE: Controla el scroll y evita el desbordamiento horizontal 🟢 */
    .nav-scrollable {
      overflow-y: auto;       /* Permite scroll vertical si la lista es larga */
      overflow-x: hidden;     /* ¡CLAVE! Oculta el desbordamiento horizontal por la animación */
      max-height: calc(100vh - 220px); /* Altura máxima para no empujar el botón de salir fuera */
    }

    .nav-pills .nav-link {
      font-size: 1.05rem; padding: 0.85rem 1rem; border-radius: 12px; margin-bottom: 8px;
      font-weight: 500; transition: all 0.25s ease;
      background-color: rgba(0, 0, 0, 0.15); color: rgba(255, 255, 255, 0.85); border: 1px solid rgba(255,255,255,0.05);

      &:hover {
        background-color: rgba(255, 255, 255, 0.25); color: #fff;
        transform: translateX(4px); /* Esto causaba el problema, ahora overflow-x: hidden lo soluciona */
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      }

      &.active {
        background-color: #fff !important; color: var(--bs-primary) !important; font-weight: 700;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
    }

    .login-link { background-color: rgba(255, 255, 255, 0.1) !important; border: 2px dashed rgba(255,255,255,0.3) !important; &:hover { background-color: rgba(255, 255, 255, 0.2) !important; } }
    .logout-btn { transition: all 0.2s; &:hover { transform: scale(1.02); box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3); } }
    .icon-size { font-size: 1.4rem; }
    .category-title { font-size: 0.8rem; letter-spacing: 1.5px; opacity: 0.8; }
    .bg-primary-darker { background-color: rgba(0, 0, 0, 0.25); }
    .animate-fade-in { animation: fadeIn 0.5s ease-in; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    .custom-scroll::-webkit-scrollbar { width: 4px; }
    .custom-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
    .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }

    @media (max-width: 991.98px) {
      .sidebar { transform: translateX(-100%); }
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