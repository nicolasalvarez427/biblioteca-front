import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// --- CAMBIO 1: Importamos SidebarComponent y quitamos HeaderComponent ---
import { SidebarComponent } from './components/sidebar/sidebar';
import { FooterComponent } from './components/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  // --- CAMBIO 2: Actualizamos imports ---
  imports: [CommonModule, RouterOutlet, SidebarComponent, FooterComponent],
  template: `
    <div class="d-flex w-100 min-vh-100 overflow-hidden">
      
      <app-sidebar #sidebar></app-sidebar>

      <div class="d-flex flex-column flex-grow-1 main-content-wrapper">
        
        <header class="navbar navbar-dark bg-primary d-lg-none sticky-top px-3 shadow-sm">
          <button class="btn btn-outline-light border-0 fs-4 py-0 px-2" (click)="sidebar.open()">
            ☰
          </button>
          <span class="navbar-brand mb-0 h1 ms-2">Biblioteca</span>
        </header>

        <main class="flex-grow-1 overflow-auto p-3 p-md-4">
          <router-outlet></router-outlet>
        </main>

        <app-footer></app-footer>
      </div>

    </div>
  `,
  styles: [`
    /* En pantallas grandes, dejamos espacio a la izquierda para la barra fija */
    @media (min-width: 992px) {
      .main-content-wrapper {
        margin-left: 280px; /* Debe coincidir con el ancho del sidebar */
      }
    }
    /* Hacemos que el main tenga su propio scroll si el contenido es muy largo */
    main {
      height: 100%; 
      background-color: rgba(248, 249, 250, 0.8); /* Un fondo suave para el contenido */
    }
  `]
})
export class App {}