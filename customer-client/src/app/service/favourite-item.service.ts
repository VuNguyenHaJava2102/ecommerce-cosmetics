import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { FavouriteItem } from '../model/class/favourite-item.class';

@Injectable({
  providedIn: 'root',
})
export class FavouriteItemService {
  private apiUrl = 'http://localhost:8080/favourite-item';
  public totalFavouriteItems = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  // public functions
  // 1
  public setQuantity(value: number): void {
    this.totalFavouriteItems.next(value);
  }

  // 2
  public getByUser(userId: number): Observable<FavouriteItem[]> {
    return this.http.get<FavouriteItem[]>(
      `${this.apiUrl}/get-by-user/${userId}`
    );
  }

  // 3
  public countTotalLikeByProduct(productId: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/count-by-product/${productId}`
    );
  }

  // 3
  public getByUserIdAndProductId(
    userId: number,
    productId: number
  ): Observable<FavouriteItem> {
    return this.http.get<FavouriteItem>(
      `${this.apiUrl}/get/${userId}/${productId}`
    );
  }

  // 4
  public saveByUserIdAndProductId(
    userId: number,
    productId: number
  ): Observable<FavouriteItem> {
    return this.http.post<FavouriteItem>(
      `${this.apiUrl}/add/${userId}/${productId}`,
      null
    );
  }

  // 5
  public deleteById(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${itemId}`);
  }
}
