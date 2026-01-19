import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, RegisterRequest, AuthResponse, UserInfo, VerificationRequest } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/auth';

  // Inicializamos subjects
  private currentUserSubject: BehaviorSubject<UserInfo | null>;
  public currentUser$: Observable<UserInfo | null>;

  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  public isAuthenticated$: Observable<boolean>;

  constructor() {
    // 1. Intentamos recuperar usuario de forma segura
    const savedUser = this.getUserFromStorage();
    const hasToken = this.hasToken();

    // 2. Inicializamos el estado basado en lo recuperado
    this.currentUserSubject = new BehaviorSubject<UserInfo | null>(savedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();

    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(hasToken && !!savedUser);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.setSession(response);
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    const payload = {
      nombre: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      password: data.password
    };
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap((response) => {
        this.setSession(response);
      })
    );
  }

  verifyEmail(verificationData: VerificationRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/verify-email`, verificationData).pipe(
      tap((response) => {
        this.setSession(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // --- MÉTODOS PRIVADOS Y UTILITARIOS ---

  private setSession(response: AuthResponse): void {
    localStorage.setItem('auth_token', response.token);
    
    // Si el backend devuelve info del usuario, la guardamos
    if (response.user) {
      localStorage.setItem('user_info', JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
    }
    
    this.isAuthenticatedSubject.next(true);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Recupera el usuario del Storage de forma SEGURA (Blindado contra errores JSON)
   */
  private getUserFromStorage(): UserInfo | null {
    const userStr = localStorage.getItem('user_info');
    if (!userStr) return null;

    try {
      // Intentamos parsear. Si 'userStr' es "undefined" o basura, esto fallará.
      return JSON.parse(userStr);
    } catch (error) {
      console.warn('Datos de usuario corruptos en localStorage. Limpiando sesión...', error);
      // Auto-reparación: Borramos los datos dañados para evitar crash
      this.logout(); 
      return null;
    }
  }

  get currentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}