import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../model/class/product.class';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/product';

  constructor(private http: HttpClient) {}

  // 1
  public getBestSellerProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/best-seller`);
  }

  // 2
  public getNewestProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/newest`);
  }

  // 3
  public getBestRatingProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/best-rating`);
  }

  // 4
  public getActiveProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/all-active`);
  }

  // 5
  public getProductsByCategoryId(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/get-by-category/${categoryId}`
    );
  }

  // 6
  public getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/get-by-id/${id}`);
  }

  // 7
  public getRelatedProducts(
    catId: number,
    proId: number
  ): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${this.apiUrl}/get-related/${catId}/${proId}`
    );
  }
}
