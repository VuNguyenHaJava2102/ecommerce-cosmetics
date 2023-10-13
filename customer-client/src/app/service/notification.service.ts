import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  url = 'http://localhost:8080/notification';

  constructor(private http: HttpClient) {}

  // 1
  public add(message: string): Observable<void> {
    const formData = new FormData();
    formData.append('message', message);
    return this.http.post<void>(`${this.url}/add`, formData);
  }
}
