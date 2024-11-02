import { Injectable } from '@angular/core';
import { Observable, pipe, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

interface LoginCredentials {
  phone: string;
  password: string;
}

interface UserData {
  phone: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
  constructor(private router: Router, protected override http: HttpClient) {
    super(http);
  }

  login(credentials: LoginCredentials): Observable<ApiResponse<any>> {
    return this.post<any>('/auth/login', credentials)
      .pipe(
        tap({
          next: (response) => {
            console.log('Réponse du serveur:', response);
            if (response.data?.token) {
              localStorage.setItem('token', response.data.token);
            }
          },
          error: (error) => {
            console.error('Erreur de connexion:', error);
            throw error;
          }
        })
      );
  }

  register(userData: UserData): Observable<ApiResponse<any>> {
    return this.post<any>('/register', userData);
  }

  logout() {
    console.log("tentative de déconnexion");
    return this.post(`/auth/logout`, {});
  }

  token(): Observable<ApiResponse<string>> {
    return this.get(`/auth/token`);
  }

  generateToken(payload: any): Observable<any> {
    console.log(payload);

    return this.post<ApiResponse<any>>(`/auth/token`, payload).pipe(
      map(apiResponse => {
        console.log(apiResponse);

        if (apiResponse.data) {
          return { token: apiResponse.data };
        } else {
          throw new Error('Token not found in the response');
        }
      })
    );
  }


  // Méthode pour décoder un token
  decodeToken(token: string): Observable<any> {
    return this.http.get<any>(`auth/decode/${token}`);
  }

  // Méthode pour vérifier la validité d'un token
  validateToken(token: string): Observable<{ isValid: boolean }> {
    return this.http.get<any>(`auth/validate/${token}`);
  }
}