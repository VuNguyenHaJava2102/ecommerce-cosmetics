import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Category } from '../model/class/model.class';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/category';

  constructor(private http: HttpClient) {}

  // 1
  public getAllStatusTrue(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/get-all`);
  }

  // 2
  public deleteById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }

  // 3
  public addNew(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/add`, category);
  }

  // 4
  public getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/get-by-id/${id}`);
  }

  // 5
  public update(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/update`, category);
  }
}
