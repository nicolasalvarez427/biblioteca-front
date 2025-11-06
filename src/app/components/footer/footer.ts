import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-white text-center py-3 mt-auto border-top">
      <div class="container">
        <small class="text-muted">
          © 2025 Biblioteca App — Desarrollado con <span class="text-danger">❤</span> y Angular
        </small>
      </div>
    </footer>
  `
})
export class FooterComponent {}