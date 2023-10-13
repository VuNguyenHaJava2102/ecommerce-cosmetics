import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { OrderItem } from '../model/class/order-item.class';

@Injectable({
  providedIn: 'root',
})
export class OrderItemService {
  private apiUrl = 'http://localhost:8080/order-item';

  constructor(private http: HttpClient) {}

  //
  public getAllByOrderId(orderId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(
      `${this.apiUrl}/get-by-order-id/${orderId}`
    );
  }
}
