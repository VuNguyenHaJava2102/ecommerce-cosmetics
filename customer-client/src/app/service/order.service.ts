import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AddOrderRequest } from '../model/interface/add-order-request.interface';
import { Order } from '../model/class/order.class';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/order';

  constructor(private http: HttpClient) {}

  //
  public getById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/get-by-id/${id}`);
  }

  //
  public getAllByUserId(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/get-by-user-id/${userId}`);
  }

  //
  public addOrder(request: AddOrderRequest): Observable<Order> {
    const formData = new FormData();
    formData.append('request', JSON.stringify(request));
    return this.http.post<Order>(`${this.apiUrl}/add`, formData);
  }

  //
  public cancelOrder(orderId: number): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/cancel/${orderId}`, null);
  }
}
