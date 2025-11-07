import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public errorMessage = signal<string | null>(null);
  public isLoading = signal(false);

  // --- CAMBIO 5: Cambiamos 'username' por 'email' y añadimos validador de email ---
  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    // 1. Validar formulario antes de hacer nada
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Para que se muestren los errores en la UI
      return;
    }

    // 2. Iniciar estado de carga y limpiar errores previos
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // --- CAMBIO 6: Obtenemos 'email' del formulario ---
    const { email, password } = this.loginForm.value;

    // --- CAMBIO 7: Llamamos al servicio con 'email' ---
    this.authService.login(email, password).subscribe({
      next: () => {
        // Exito: finaliza carga y redirige a '/books'
        this.isLoading.set(false);
        this.router.navigate(['/books']);
      },
      error: (err) => {
        // Error: finaliza carga y muestra mensaje
        this.isLoading.set(false);
        console.error('Error en login:', err);
        // Ajusta esto según la estructura real de tu error de backend si es necesario
        this.errorMessage.set(err.error?.message || err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      }
    });
  }
}