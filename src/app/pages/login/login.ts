import { Component, inject, signal } from '@angular/core';
// 1. CORRECCIÓN: Importa 'ReactiveFormsModule' (el módulo), no 'provideReactiveFormsModule'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
// 2. CORRECCIÓN: Quitamos el 'import { routes }' que no va aquí

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html', // <-- CORREGIDO
  styleUrl: './login.scss' // <-- CORREGIDO
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
    if (this.loginForm.invalid) {
      this.errorMessage.set('Por favor, completa todos los campos correctamente.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (respuesta) => {
        this.isLoading.set(false);
        console.log('Login exitoso:', respuesta);
        this.router.navigate(['/']); 
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error en login:', err);
        this.errorMessage.set(err.message || 'Error desconocido al iniciar sesión');
      }
    });
  }
}