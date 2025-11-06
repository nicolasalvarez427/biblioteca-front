import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public errorMessage = signal<string | null>(null);
  public successMessage = signal<string | null>(null);
  public isLoading = signal(false);

  // Formulario sin el campo 'username' ni 'role'
  public registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const formValue = this.registerForm.value;

    // Generamos el username automáticamente
    const generatedUsername = `${formValue.firstName.trim().toLowerCase()}.${formValue.lastName.trim().toLowerCase()}`.replace(/\s+/g, '');

    // Preparamos el objeto final, forzando el rol a 'Estudiante'
    const usuarioParaRegistrar = {
      ...formValue,
      username: generatedUsername,
      role: 'Estudiante' // <--- Rol fijo por seguridad
    };

    this.authService.register(usuarioParaRegistrar).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set(`¡Cuenta creada! Tu usuario es: <strong>${generatedUsername}</strong>. Redirigiendo...`);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 4000); // Un poco más de tiempo para que noten el usuario generado
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Error en registro:', err);
        this.errorMessage.set(err.error?.message || 'No se pudo registrar el usuario.');
      }
    });
  }
}