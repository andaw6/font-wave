import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.interface';
import { HttpClient } from '@angular/common/http';
import { UserAuthService } from './user-auth.service';
import { IUser } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiService {
  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private authService: UserAuthService, http: HttpClient) {
    super(http);
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    if (this.authService.isAuthenticated()) {
      this.getCurrentUser().subscribe({
        next: (user) => {
          if (this.isIUser(user)) {
            this.currentUserSubject.next(user);
          } else {
            console.error('Données utilisateur non valides', user);
          }
        },
        error: (error) => console.error("Erreur de chargement de l'utilisateur", error)
      });
    }
  }

  private isIUser(data: any): data is IUser {
    return (
      data &&
      typeof data.id === 'string' &&
      typeof data.name === 'string' &&
      typeof data.email === 'string' // Vérifier toutes les propriétés nécessaires de IUser
    );
  }

  getCurrentUser(): Observable<IUser> {
    if (!this.authService.isAuthenticated()) {
      return throwError(() => new Error('Utilisateur non authentifié'));
    }

    return this.get<ApiResponse<IUser>>('/users/current').pipe(
      map(response => {
        if (response.data && this.isIUser(response.data)) {
          return response.data;
        }
        throw new Error('Données utilisateur non valides');
      }),
      tap(userData => {
        this.currentUserSubject.next(userData);
      }),
      catchError((error) => {
        console.error("Erreur de récupération de l'utilisateur", error);
        return throwError(() => error);
      })
    );
  }
}