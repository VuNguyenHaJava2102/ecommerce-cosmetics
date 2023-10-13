import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Notification } from '../model/class/notification.class';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private apiUrl = 'http://localhost:8080/notification';

  constructor(private http: HttpClient) {}

  // 1
  public getAllOrderByIdDesc(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/get-all`);
  }

  // 2
  public setOneRead(id: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.apiUrl}/set-one-read/${id}`);
  }

  public setAllRead(): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/set-all-read`);
  }
}
