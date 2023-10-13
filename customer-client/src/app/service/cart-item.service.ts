import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../model/class/cart-item.class';

@Injectable({
  providedIn: 'root',
})
export class CartItemService {
  private apiUrl = 'http://localhost:8080/cart-item';
  public totalCartItems = new BehaviorSubject<number>(0);

  // constructor, ngOn
  constructor(private http: HttpClient) {}

  // public functions
  // 1
  public setQuantity(value: number): void {
    this.totalCartItems.next(value);
  }

  // 2
  public getCartItemsByUserId(userId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl}/get-by-user/${userId}`);
  }

  // 3
  public addNewCartItem(cartItem: any): Observable<CartItem> {
    return this.http.post<CartItem>(`${this.apiUrl}/add`, cartItem);
  }

  // 4
  public deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // 5
  public updateQuantityById(
    itemId: number,
    quantity: number
  ): Observable<CartItem> {
    return this.http.put<CartItem>(
      `${this.apiUrl}/update-quantity/${itemId}/${quantity}`,
      null
    );
  }
}
