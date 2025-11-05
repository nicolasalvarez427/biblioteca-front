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
    ReactiveFormsModule, // Importante para [formGroup]
    RouterLink         // Para el enlace a "Registrarse"
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // Inyección de servicios moderna
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals para manejar el estado de la UI
  public errorMessage = signal<string | null>(null);
  public isLoading = signal(false);

  // Definición del Formulario Reactivo
  public loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Método que se llama al enviar el formulario
  onSubmit() {
    // Si el formulario no es válido, no hacer nada
    if (this.loginForm.invalid) {
      this.errorMessage.set('Por favor, completa todos los campos correctamente.');
      return;
    }

    this.isLoading.set(true); // Activa el spinner
    this.errorMessage.set(null); // Limpia errores previos

    const { username, password } = this.loginForm.value;

    // Llamar al servicio de autenticación
    this.authService.login(username, password).subscribe({
      next: (respuesta) => {
        // ¡Éxito!
        this.isLoading.set(false);
        console.log('Login exitoso:', respuesta);
        // Redirigir al Dashboard (que crearemos después)
        this.router.navigate(['/']); 
      },
      error: (err) => {
        // ¡Error!
        this.isLoading.set(false);
        console.error('Error en login:', err);
        // Mostramos el mensaje de error que viene de la API
        this.errorMessage.set(err.message || 'Error desconocido al iniciar sesión');
      }
    });
  }
}