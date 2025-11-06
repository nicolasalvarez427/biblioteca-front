import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header'; // <-- Importar
import { FooterComponent } from './components/footer/footer'; // <-- Importar

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent], // <-- Agregar a imports
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
  protected readonly title = signal('Biblioteca Front');
}
