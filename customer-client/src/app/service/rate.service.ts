import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Rating } from '../model/class/rating.class';

@Injectable({
  providedIn: 'root',
})
export class RateService {
  private apiUrl = 'http://localhost:8080/rating';

  constructor(private http: HttpClient) {}

  // public functions
  // 1
  public getAllOrderById(): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/get-all`);
  }

  // 2
  public getRatingByProduct(productId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(
      `${this.apiUrl}/get-by-product/${productId}`
    );
  }
}
