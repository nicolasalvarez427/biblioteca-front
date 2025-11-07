import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Guard que protege rutas privadas.
 * Si el usuario no está autenticado, lo redirige al login.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true; // ✅ Usuario autenticado
  }

  // ❌ Usuario no autenticado → redirige a login
  router.navigate(['/login']);
  return false;
};
