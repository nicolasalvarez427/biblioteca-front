import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// 🟢 CAMBIO: Importamos HeaderComponent y eliminamos SidebarComponent
import { HeaderComponent } from './components/header/header'; 
import { FooterComponent } from './components/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  // 🟢 CAMBIO: Actualizamos imports
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent], 
  template: `
    <app-header></app-header> 

    <main class="d-flex flex-column flex-grow-1">
      <router-outlet></router-outlet>
    </main>

    <app-footer></app-footer>
  `,
  styles: [`
    main {
      height: 100%; 
      background-color: rgba(248, 249, 250, 0.8); /* Un fondo suave para el contenido */
    }
  `]
})
export class App {}