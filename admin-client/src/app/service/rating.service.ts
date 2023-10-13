import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rating } from '../model/class/rating.class';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  private apiUrl = 'http://localhost:8080/rating';

  constructor(private http: HttpClient) {}

  // public functions
  // 1
  public getAllOrderById(): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/get-all`);
  }

  // 2
  public deleteById(ratingId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${ratingId}`);
  }
}
