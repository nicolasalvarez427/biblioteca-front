import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-light text-center text-lg-start mt-auto py-3 border-top">
      <div class="container text-center">
        <span class="text-muted">
          © 2025 Biblioteca App - Desarrollado con <span class="text-danger">❤</span> y <strong>Angular</strong>
        </span>
      </div>
    </footer>
  `
})
export class FooterComponent {}