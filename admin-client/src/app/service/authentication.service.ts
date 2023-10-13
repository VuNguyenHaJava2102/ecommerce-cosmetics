import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';

import { User } from '../model/class/user.class';
import { LoginRequest } from '../model/interface/login-request.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public apiUrl = 'http://localhost:8080';
  private token: string;
  private loggedInUsername: string;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {}

  // main function
  // 1
  public login(loginRequest: LoginRequest): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${this.apiUrl}/user/login`, loginRequest, {
      observe: 'response',
    });
  }

  // 2
  public logout(): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  // 3
  public saveTokenToStorage(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // 4
  public saveUserToStorage(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // 5
  public getUserFromStorage(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  // 6
  public getTokenFromStorage(): string {
    return this.token;
  }

  // 7
  public loadTokenFromStorage(): void {
    this.token = localStorage.getItem('token');
  }

  // 8
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
          this.loggedInUsername = subject;
          return true;
        }
        return false;
      }
      return false;
    } else {
      // this.logout();
      return false;
    }
  }
}
