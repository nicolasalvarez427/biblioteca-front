import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interfaz para el usuario que guardaremos en el Signal
export interface UsuarioLogueado {
  id: string;
  username: string;
  role: 'Administrador' | 'Estudiante';
}

// Interfaz para la respuesta COMPLETA de la API de login
export interface AuthResponse {
  token: string;
  usuario: UsuarioLogueado;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // --- SIGNALS DE ESTADO ---
  
  // Estado inicial: 'undefined' = no sabemos, 'null' = no logueado, 'UsuarioLogueado' = logueado
  readonly #currentUser = signal<UsuarioLogueado | null | undefined>(undefined);

  // Signals públicos (solo lectura) que el resto de la app usará
  public readonly currentUser = this.#currentUser.asReadonly();
  public readonly isAuthenticated = computed(() => !!this.#currentUser());
  public readonly isAdmin = computed(() => this.#currentUser()?.role === 'Administrador');

  constructor(private http: HttpClient) {
    // 1. Cargar datos de la sesión desde localStorage al iniciar la app
    this.cargarEstadoDesdeStorage();

    // 2. Crear un "effect" que se ejecute CADA VEZ que el signal #currentUser cambie
    effect(() => {
      const user = this.#currentUser();
      if (user) {
        // Si hay un usuario (login), lo guardamos en localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else if (user === null) {
        // Si el usuario es null (logout), borramos los datos
        localStorage.removeItem('currentUser');
        localStorage.removeItem('auth_token');
      }
      // Si es 'undefined', no hacemos nada (aún está cargando)
    });
  }

  // --- MÉTODOS PÚBLICOS DE AUTENTICACIÓN ---

  /**
   * Intenta iniciar sesión llamando a la API del backend.
   */
  login(username: string, password: string): Observable<AuthResponse> {
    // Gracias al PROXY, '/api' se convierte en 'http://localhost:3000/api'
    const url = '/api/auth/login';
    
    return this.http.post<AuthResponse>(url, { username, password }).pipe(
      tap(respuesta => {
        // Éxito:
        // 1. Guardamos el token JWT en localStorage
        localStorage.setItem('auth_token', respuesta.token);
        // 2. Actualizamos el signal del usuario (esto disparará el 'effect')
        this.#currentUser.set(respuesta.usuario);
      }),
      catchError(error => {
        // Fallo:
        // Limpiamos cualquier estado viejo y pasamos el error
        this.logout();
        return throwError(() => error.error); // Pasa el error de la API
      })
    );
  }

  /**
   * Registra un nuevo usuario llamando a la API del backend.
   */
  register(username: string, password: string, role: 'Administrador' | 'Estudiante'): Observable<any> {
    const url = '/api/auth/register';
    return this.http.post(url, { username, password, role });
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout() {
    this.#currentUser.set(null); // Esto disparará el 'effect' para limpiar localStorage
  }
  
  /**
   * Obtiene el token JWT actual de localStorage.
   * (Otros servicios usarán esto para las peticiones protegidas)
   */
  public getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // --- MÉTODOS PRIVADOS ---

  /**
   * Carga el usuario desde localStorage al iniciar el servicio.
   */
  private cargarEstadoDesdeStorage() {
    const userString = localStorage.getItem('currentUser');
    const token = localStorage.getItem('auth_token');
    
    if (userString && token) {
      // (En una app real, validaríamos el token aquí con una llamada a la API)
      // Por ahora, confiamos en los datos guardados.
      this.#currentUser.set(JSON.parse(userString));
    } else {
      // Si falta alguno de los datos, lo marcamos como 'no logueado'
      this.#currentUser.set(null);
    }
  }
}