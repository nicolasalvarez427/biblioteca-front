import { Injectable, signal, computed, effect, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, interval, Subscription } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface UsuarioLogueado {
  id: string;
  username: string;
  role: 'Administrador' | 'Estudiante';
}

export interface AuthResponse {
  token: string;
  usuario: UsuarioLogueado;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private tokenCheckSub?: Subscription;

  // --- STATE SIGNALS ---
  readonly #currentUser = signal<UsuarioLogueado | null | undefined>(undefined);
  public readonly currentUser = this.#currentUser.asReadonly();
  public readonly isAuthenticated = computed(() => !!this.#currentUser());
  public readonly isAdmin = computed(() => this.#currentUser()?.role === 'Administrador');

  constructor(private http: HttpClient) {
    this.cargarEstadoDesdeStorage();

    // Sincroniza localStorage con el estado del usuario
    effect(() => {
      const user = this.#currentUser();
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else if (user === null) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('auth_token');
      }
    });

    // 🕒 Inicia validación periódica del token
    this.iniciarVerificacionDeToken();
  }

  // --- MÉTODOS DE AUTENTICACIÓN ---

  // --- CAMBIO 3: El método ahora recibe 'email' ---
  login(email: string, password: string): Observable<AuthResponse> {
    const url = '/api/auth/login';

    // --- CAMBIO 4: Enviamos 'email' en el cuerpo de la petición ---
    return this.http.post<AuthResponse>(url, { email, password }).pipe(
      tap(respuesta => {
        localStorage.setItem('auth_token', respuesta.token);
        this.#currentUser.set(respuesta.usuario);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error.error);
      })
    );
  }

  register(usuario: {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'Administrador' | 'Estudiante';
  }): Observable<any> {
    return this.http.post('/api/auth/register', usuario);
  }

  logout() {
    this.#currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // --- VALIDACIÓN DEL TOKEN JWT ---
  private isTokenValid(token: string | null): boolean {
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      if (payload.exp && payload.exp < now) {
        console.warn('🔒 Token expirado');
        return false;
      }
      return true;
    } catch {
      console.warn('⚠️ Token inválido');
      return false;
    }
  }

  private iniciarVerificacionDeToken() {
    // Revisa el token cada 30 segundos
    this.tokenCheckSub = interval(30_000).subscribe(() => {
      const token = this.getToken();
      if (!this.isTokenValid(token)) {
        this.logout();
      }
    });
  }

  private cargarEstadoDesdeStorage() {
    const userString = localStorage.getItem('currentUser');
    const token = localStorage.getItem('auth_token');

    if (userString && token && this.isTokenValid(token)) {
      this.#currentUser.set(JSON.parse(userString));
    } else {
      this.#currentUser.set(null);
    }
  }

  ngOnDestroy(): void {
    this.tokenCheckSub?.unsubscribe();
  }
}