import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

// Definimos una interfaz para la respuesta del login
export interface AuthResponse {
  token: string;
  usuario: {
    id: string;
    username: string;
    role: 'Administrador' | 'Estudiante';
  };
}

// Interfaz para el usuario que guardaremos en el Signal
export interface UsuarioLogueado {
  id: string;
  username: string;
  role: 'Administrador' | 'Estudiante';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // --- SIGNALS DE ESTADO ---
  // El 'signal' principal que guarda el estado del usuario
  readonly #currentUser = signal<UsuarioLogueado | null | undefined>(undefined);
  // 'undefined' = Aún no sabemos (cargando)
  // 'null' = Sabemos que NO está logueado
  // 'UsuarioLogueado' = Sabemos que SÍ está logueado

  // Signals computados (públicos) que derivan del principal
  public readonly isAuthenticated = computed(() => !!this.#currentUser());
  public readonly currentUser = computed(() => this.#currentUser());
  public readonly isAdmin = computed(() => this.#currentUser()?.role === 'Administrador');

  // --- DEPENDENCIAS ---
  constructor(private http: HttpClient) {
    // 1. Cargar el token desde localStorage al iniciar el servicio
    this.cargarTokenDesdeStorage();

    // 2. EFFECT: Guardar en localStorage CADA VEZ que el usuario cambie
    effect(() => {
      const user = this.#currentUser();
      if (user) {
        // Si hay usuario, guardamos el token
        // (Asumimos que el token está guardado en una variable temporal o lo volvemos a pedir)
        // Por simplicidad, aquí guardaremos el usuario. Para JWT, guardaríamos el TOKEN.
        // Vamos a re-implementar esto para guardar el token.
      } else {
        // Si no hay usuario, borramos el token
        localStorage.removeItem('auth_token');
      }
    });
  }

  // --- MÉTODOS PÚBLICOS ---

  // LOGIN: Llama a la API del backend
  login(username: string, password: string): Observable<AuthResponse> {
    // Gracias al PROXY (Paso 10), '/api' se convierte en 'http://localhost:3000/api'
    const url = '/api/auth/login';
    
    return this.http.post<AuthResponse>(url, { username, password }).pipe(
      tap(respuesta => {
        // 1. Guardar el token
        this.guardarToken(respuesta.token);
        // 2. Actualizar el Signal del usuario
        this.#currentUser.set(respuesta.usuario);
      })
    );
  }

  // REGISTRO: Llama a la API del backend
  register(username: string, password: string, role: 'Administrador' | 'Estudiante'): Observable<any> {
    const url = '/api/auth/register';
    return this.http.post(url, { username, password, role });
  }

  // LOGOUT: Limpia el estado
  logout() {
    this.guardarToken(null); // Borra el token de localStorage
    this.#currentUser.set(null); // Pone el signal de usuario a 'null'
  }

  // --- MÉTODOS PRIVADOS DE MANEJO DE TOKEN ---

  private guardarToken(token: string | null) {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private cargarTokenDesdeStorage() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Si hay un token, necesitamos validarlo.
      // Por ahora, vamos a "confiar" en él y decodificarlo (versión simple)
      // En una app real, haríamos una llamada a '/api/auth/profile' para validarlo
      try {
        const payload = JSON.parse(atob(token.split('.')[1])) as { id: string, role: string, username: string }; // Esto es una decodificación simple
        
        // ¡Cuidado! Esta info puede estar desactualizada.
        // Lo ideal es que el backend devuelva el 'username' en el token o hacer otra llamada.
        // Asumamos que el backend lo incluye (vamos a modificar el backend)
        
        // --- VAMOS A MODIFICAR EL BACKEND PARA QUE ESTO FUNCIONE ---
        // Por ahora, simulamos que el token nos da el usuario
        
        // --- SIMULACIÓN (mientras ajustamos el backend) ---
        // Si el token existe, asumimos que es válido. Haremos la llamada de validación después.
        // Vamos a necesitar una ruta de "perfil" en el backend.
        
        // --- Simplificación por ahora: No cargamos el usuario, solo sabemos que "hay un token" ---
        // Esto no es ideal. Vamos a hacerlo bien.
        
        // --- RE-ENFOQUE ---
        // El login nos da el token Y el usuario.
        // Vamos a guardar AMBOS en localStorage. Es más fácil.
        
        // Vuelve a la función 'login'
        // ... (Ver 'login' - ya lo hace)
        
        // Re-escribamos el 'effect' y el 'cargarToken'
        this.refactorizarManejoDeStorage();
      } catch (e) {
        console.error("Error decodificando token", e);
        this.logout();
      }
      
    } else {
      this.#currentUser.set(null); // No hay token, sabemos que no está logueado
    }
  }
  
  // --- VERSIÓN MEJORADA (Refactorización) ---
  
  private refactorizarManejoDeStorage() {
    // 1. Al iniciar, cargar desde localStorage
    const userString = localStorage.getItem('currentUser');
    if (userString) {
      this.#currentUser.set(JSON.parse(userString));
    } else {
      this.#currentUser.set(null); // No hay usuario guardado
    }
    
    // 2. Crear un effect que GUARDE en localStorage cuando el signal cambie
    effect(() => {
      const user = this.#currentUser();
      if (user) {
        // Si hay un usuario, lo guardamos
        localStorage.setItem('currentUser', JSON.stringify(user));
      } else {
        // Si el usuario es null (logout), lo borramos
        localStorage.removeItem('currentUser');
        localStorage.removeItem('auth_token'); // Borramos el token también
      }
    });
  }
  
  // Modificamos el login para usar esta nueva lógica
  loginRefactorizado(username: string, password: string): Observable<AuthResponse> {
    const url = '/api/auth/login';
    return this.http.post<AuthResponse>(url, { username, password }).pipe(
      tap(respuesta => {
        // 1. Guardar el token (útil para las peticiones API)
        this.guardarToken(respuesta.token);
        // 2. Actualizar el Signal del usuario (esto disparará el 'effect')
        this.#currentUser.set(respuesta.usuario);
      })
    );
  }
  
  // Constructor (usando la versión refactorizada)
  constructor(private http: HttpClient) {
    this.refactorizarManejoDeStorage();
  }
}