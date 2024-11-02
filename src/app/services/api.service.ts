import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.interface';
import { HttpOptions } from '../models/http-options.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected baseUrl = environment.apiUrl; // Utiliser l'URL complète du backend

  constructor(protected http: HttpClient) { }

  private getToken(): string | null {
    return localStorage.getItem('token'); // Récupère le token du local storage
  }

  private addAuthHeader(options: HttpOptions = {}): HttpOptions {
    const token = this.getToken();
    const headers = options.headers || new HttpHeaders();
    const authHeaders = token ? headers.set('Authorization', `Bearer ${token}`) : headers;

    return { ...options, headers: authHeaders, withCredentials: true };
  }

  public get<T>(endpoint: string, params?: { [key: string]: any }, options?: HttpOptions): Observable<ApiResponse<T>> {
    let fullUrl = `${this.baseUrl}${endpoint}`;

    // Formate les query params et ajoute-les à l'URL
    if (params) {
      const queryString = this.formatQueryParams(params);
      fullUrl += `?${queryString}`; 
    }

    return this.http.get<ApiResponse<T>>(fullUrl, this.addAuthHeader(options)).pipe(
      tap(response => this.logResponse('GET', fullUrl, response)),
      catchError(error => this.handleError(error))
    );
  }


  protected post<T>(endpoint: string, data: any, options?: HttpOptions): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.post<ApiResponse<T>>(fullUrl, data, this.addAuthHeader(options)).pipe(
      tap(response => this.logResponse('POST', fullUrl, response)),
      catchError(error => this.handleError(error))
    );
  }

  protected put<T>(endpoint: string, data: any, options?: HttpOptions): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.put<ApiResponse<T>>(fullUrl, data, this.addAuthHeader(options)).pipe(
      tap(response => this.logResponse('PUT', fullUrl, response)),
      catchError(error => this.handleError(error))
    );
  }

  protected delete<T>(endpoint: string, options?: HttpOptions): Observable<ApiResponse<T>> {
    const fullUrl = `${this.baseUrl}${endpoint}`;
    return this.http.delete<ApiResponse<T>>(fullUrl, this.addAuthHeader(options)).pipe(
      tap(response => this.logResponse('DELETE', fullUrl, response)),
      catchError(error => this.handleError(error))
    );
  }

  private logResponse(method: string, url: string, response: any): void {
    if (!environment.production) {
      console.log(`[${method}] ${url}:`, response);
    }
  }

  private handleError(error: any): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      console.error('Erreur client:', error.error.message);
    } else {
      // Erreur côté serveur
      console.error('Détails de l\'erreur:', {
        status: error.status,
        body: error.error,
        url: error.url,
        headers: error.headers
      });
    }
    return throwError(() => error);
  }

  formatQueryParams(params: { [key: string]: any }): string {
    let httpParams = new HttpParams();

    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    return httpParams.toString();
  }
}
