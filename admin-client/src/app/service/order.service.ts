import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Order } from '../model/class/order.class';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/order';

  constructor(private http: HttpClient) {}

  // 1
  public getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/get-all`);
  }

  // 2
  public getById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/get-by-id/${orderId}`);
  }

  // 3
  public updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.get<Order>(
      `${this.apiUrl}/update-status/${orderId}/${status}`
    );
  }
}
