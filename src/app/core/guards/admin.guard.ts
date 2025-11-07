import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

/**
 * Guard para rutas exclusivas de administradores.
 * Si el usuario no es admin o no está autenticado, lo redirige.
 */
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  
  if (user && user.role === 'Administrador') {
    return true; // ✅ Autorizado
  }

  // ❌ No autorizado → Redirige
  router.navigate(['/books']);
  return false;
};
