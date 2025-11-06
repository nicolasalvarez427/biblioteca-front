import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Importamos tus nuevos componentes
import { HeaderComponent } from './components/header/header';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  // Los agregamos aquí para poder usarlos en el HTML
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'biblioteca-front';
}