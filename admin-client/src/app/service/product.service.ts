import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Product } from '../model/class/product.class';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/product';

  // constructor
  constructor(private http: HttpClient) {}

  // 1
  public getAllActive(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/all-active`);
  }

  // 2
  public getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/get-by-id/${id}`);
  }

  public getTop10BestSeller(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/top10-best-seller`);
  }

  //
  public addNew(request: Product, imageFile: File): Observable<Product> {
    const formData = new FormData();
    formData.append('request', JSON.stringify(request));
    formData.append('imageFile', imageFile);
    return this.http.post<Product>(`${this.apiUrl}/add`, formData);
  }

  //
  public deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  //
  public update(request: Product, imageFile: File): Observable<Product> {
    const formData = new FormData();
    formData.append('request', JSON.stringify(request));
    formData.append('imageFile', imageFile);
    return this.http.put<Product>(`${this.apiUrl}/update`, formData);
  }
}
