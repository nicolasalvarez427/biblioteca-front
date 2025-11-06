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

  public loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
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

    // 3. Obtener valores del formulario
    const { username, password } = this.loginForm.value;

    // 4. Llamar al servicio de autenticación
    this.authService.login(username, password).subscribe({
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