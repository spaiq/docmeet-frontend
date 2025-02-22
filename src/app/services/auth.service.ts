import { Injectable } from '@angular/core';
import {environment} from '../../environment.dev';
import {Observable, Subscription, switchMap, tap, throwError, timer} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = environment.authUrl;
  private refreshTokenTimer: Subscription | null = null;

  constructor(private http: HttpClient){}

  login(): void {
    window.location.href = `${this.authUrl}/auth?client_id=${environment.clientId}&redirect_uri=${window.location.origin}/&response_type=code&scope=openid`;
  }


  handleAuthCallback(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const code = this.getAuthorizationCodeFromUrl();
      if (code) {

        this.exchangeCodeForTokens(code).subscribe({
          next: () => {
            resolve(true);
          },
            error: (err) => reject(err)
        });

        resolve(true);
      }

      resolve(false);
    });
  }

  private getAuthorizationCodeFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search);

    return params.get('code');
  }

  isAccessTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const jwtToken = JSON.parse(atob(token.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    return expires.getTime() < Date.now();
  }

  isRefreshTokenExpired(): boolean {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return true;

    const jwtToken = JSON.parse(atob(refreshToken.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    return expires.getTime() < Date.now();
  }

  private exchangeCodeForTokens(code: string): Observable<any> {
    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('code', code)
      .set('redirect_uri', window.location.origin + "/")
      .set('client_id', environment.clientId);

    return this.http.post(`${this.authUrl}/token`, body).pipe(
      tap((response: any) => {
        this.storeToken(response.access_token, response.refresh_token);
      })
    );
  }

  deleteTokens(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('refresh_token');
  }

  storeToken(token: string, refreshToken: string): void {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('refresh_token', refreshToken);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {

      const params = new HttpParams()
        .set('client_id', environment.clientId)
        .set('refresh_token', refreshToken)
        .set('grant_type', 'refresh_token');

      return this.http.post(`${this.authUrl}/token`, params)
        .pipe(
          tap((response: any) => {
            this.storeToken(response.access_token, response.refresh_token);
          },error => {
            alert('Error while refreshing token! Logging out...');
            this.deleteTokens();
            this.stopRefreshTokenTimer();
            return throwError(() => error);
          })
        );
    } else {
      return throwError(() => 'No refresh token available');
    }
  }


  isAuthenticated(): boolean {
    return !!this.getToken() && !this.isAccessTokenExpired() && !this.isRefreshTokenExpired();
  }

  startRefreshTokenTimer(): void {
    const token = this.getToken();
    if (token) {
      const jwtToken = JSON.parse(atob(token.split('.')[1]));
      const expires = new Date(jwtToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000); // Refresh 1 minute before expiry

      this.refreshTokenTimer = timer(timeout).pipe(
        switchMap(() => this.refreshToken())
      ).subscribe(() => {
        this.startRefreshTokenTimer();
      });
    }
  }

  isRefreshTokenTimerStarted(): boolean {
    return !!this.refreshTokenTimer
  }

  stopRefreshTokenTimer(): void {
    if (this.refreshTokenTimer) {
      this.refreshTokenTimer.unsubscribe();
    }
  }

  logout(): void {
    window.location.href = `${this.authUrl}/logout?client_id=${environment.clientId}&post_logout_redirect_uri=${window.location.origin}`;
    this.deleteTokens();
    this.stopRefreshTokenTimer();
  }
}
