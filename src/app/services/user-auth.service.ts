import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.interface';
import { DecodedToken } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private readonly tokenKey = 'token';

  constructor(private authService: AuthService, private router: Router) { }

  isAuthenticated(): Observable<boolean> {
    const token = this.getToken();

    // Vérifie d'abord si le token est présent et valide côté client
    if (token && !this.isTokenExpired(token)) {
      // Si le token est valide côté client, on fait un appel au backend pour vérifier sa validité côté serveur
      return this.authService.token().pipe(
        map((response: ApiResponse<string>) => {
          if (response && response.data) {
            this.setToken(response.data); // Met à jour le token s'il y en a un nouveau
            return true;
          }

          // Si le serveur ne valide pas le token, on déconnecte l'utilisateur
          this.logout();
          return false;
        }),
        catchError(() => {
          // En cas d'erreur lors de l'appel au serveur, on déconnecte l'utilisateur
          this.logout();
          return of(false);
        })
      );
    } else {
      // Si le token est absent ou expiré côté client, on déconnecte immédiatement
      this.logout();
      return of(false);
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = payload.exp * 1000;
      return Date.now() > expirationDate;
    } catch (e) {
      return true; // Considère le token comme expiré en cas d'erreur
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/login']);
  }

  decodeToken(): DecodedToken {
    const token = this.getToken();
    if (!token) return { role: null, userId: null };

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role || null;
      const userId = payload.userId || null;
      return { role, userId };
    } catch (e) {
      return { role: null, userId: null }; // Retourne null en cas d'erreur de décodage
    }
  }
}
