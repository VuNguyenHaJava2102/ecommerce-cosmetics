import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';

import { User } from '../model/class/user.class';
import { LoginRequest } from '../model/interface/login-request.interface';
import { RegisterRequest } from '../model/interface/register-request.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public apiUrl = 'http://localhost:8080/user';
  private token: string;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  // main function
  // 1, 2, 3: login, register, logout
  // 1
  public login(loginRequest: LoginRequest): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${this.apiUrl}/login`, loginRequest, {
      observe: 'response',
    });
  }

  // 2
  public register(registerRequest: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, registerRequest);
  }

  // 3
  public logout(): void {
    this.token = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  // 4
  public saveTokenToStorage(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // 5
  public saveUserToStorage(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // 6
  public getUserFromStorage(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  // 7
  public getTokenFromStorage(): string {
    return this.token;
  }

  // 8
  public loadTokenFromStorage(): void {
    this.token = localStorage.getItem('token');
  }

  // 9
  /*
  - loggedIn = true khi decode token được subject(username) not empty và token chưa hết hạn
  - token chưa hết hạn đồng nghĩa rằng token đó được decode và not empty
  */
  public isUserLoggedIn(): boolean {
    this.loadTokenFromStorage();
    if (this.token != null && this.token != '') {
      let subject = this.jwtHelper.decodeToken(this.token).sub;
      if (subject != null && this.token != '') {
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          return true;
        }
        return false;
      }
      return false;
    } else {
      return false;
    }
  }
}
