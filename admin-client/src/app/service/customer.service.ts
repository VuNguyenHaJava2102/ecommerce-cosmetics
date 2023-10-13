import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Customer } from '../model/class/customer.class';
import { AddCustomerRequest } from '../model/interface/add-customer-request.interface';
import { UpdateCustomerRequest } from '../model/interface/update-customer-request.interface';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = 'http://localhost:8080/user';

  // constructor, ngOn
  constructor(private http: HttpClient) {}

  // 1
  public getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/all-customers`);
  }

  // 2
  public add(request: AddCustomerRequest, file: File): Observable<Customer> {
    const formData = new FormData();
    formData.append('request', JSON.stringify(request));
    formData.append('imageFile', file);
    return this.http.post<Customer>(`${this.apiUrl}/add-customer`, formData);
  }

  // 3
  public deleteByEmail(email: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-customer/${email}`);
  }

  // 4
  public getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/get-by-id/${id}`);
  }

  // 5
  public update(
    request: UpdateCustomerRequest,
    file: File
  ): Observable<Customer> {
    const formData = new FormData();
    formData.append('request', JSON.stringify(request));
    formData.append('imageFile', file);
    return this.http.put<Customer>(`${this.apiUrl}/update-customer`, formData);
  }
}
