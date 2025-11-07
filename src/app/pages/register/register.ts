import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
  public showPassword = signal(false);
  public passwordStrength = signal<{ score: number, color: string, message: string }>({ 
    score: 0, color: '', message: '' 
  });

  // --- 🟢 CAMBIO 1: Definimos el validador personalizado aquí mismo ---
  passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    // Si las contraseñas no coinciden y ambos campos tienen valores, devolvemos un error
    return password && confirmPassword && password !== confirmPassword ? { mismatch: true } : null;
  };

  public registerForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    // 🟢 CAMBIO 2: Añadimos el nuevo campo
    confirmPassword: ['', [Validators.required]]
  }, { 
    // 🟢 CAMBIO 3: Aplicamos el validador al grupo completo
    validators: this.passwordMatchValidator 
  });

  togglePasswordVisibility(): void {
    this.showPassword.update(value => !value);
  }

  checkPasswordStrength(event: Event): void {
    const password = (event.target as HTMLInputElement).value;
    if (!password) {
        this.passwordStrength.set({ score: 0, color: '', message: '' });
        return;
    }
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
        case 0: case 1: this.passwordStrength.set({ score: 25, color: 'danger', message: 'Débil 😟' }); break;
        case 2: this.passwordStrength.set({ score: 50, color: 'warning', message: 'Regular 😐' }); break;
        case 3: this.passwordStrength.set({ score: 75, color: 'info', message: 'Buena 🙂' }); break;
        case 4: this.passwordStrength.set({ score: 100, color: 'success', message: '¡Fuerte! 💪' }); break;
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // 🟢 CAMBIO 4: Extraemos 'confirmPassword' para NO enviarlo al backend
    const { confirmPassword, ...formValue } = this.registerForm.value;
    
    const generatedUsername = `${formValue.firstName.trim().toLowerCase()}.${formValue.lastName.trim().toLowerCase()}`.replace(/\s+/g, '');
    
    const usuarioParaRegistrar = { 
      ...formValue, // Esto ya NO incluye confirmPassword
      username: generatedUsername, 
      role: 'Estudiante' 
    };

    this.authService.register(usuarioParaRegistrar).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set(`¡Cuenta creada! Tu usuario es: <strong>${generatedUsername}</strong>. Redirigiendo...`);
        setTimeout(() => this.router.navigate(['/login']), 4000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'No se pudo registrar el usuario.');
      }
    });
  }
}