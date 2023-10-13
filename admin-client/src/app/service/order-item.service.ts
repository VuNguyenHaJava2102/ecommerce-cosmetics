import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { OrderItem } from '../model/class/order-item.class';

@Injectable({
  providedIn: 'root',
})
export class OrderItemService {
  private apiUrl = 'http://localhost:8080/order-item';

  constructor(private httpClient: HttpClient) {}

  // 1
  public getByOrder(id: number): Observable<OrderItem[]> {
    return this.httpClient.get<OrderItem[]>(
      this.apiUrl + '/get-by-order/' + id
    );
  }
}
