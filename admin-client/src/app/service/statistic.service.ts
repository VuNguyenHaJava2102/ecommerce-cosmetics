import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/class/product.class';
import { Statistics } from '../model/class/statistics.class';

@Injectable({
  providedIn: 'root',
})
export class StatisticService {
  url = 'http://localhost:8080/statistic';

  constructor(private httpClient: HttpClient) {}

  // 1
  public getInventory(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.url}/get-inventory`);
  }

  // 2
  public getRevenueOfCurrentYear(): Observable<number> {
    return this.httpClient.get<number>(`${this.url}/revenue-current-year`);
  }

  // 3
  public getRevenueOfCurrentMonth(): Observable<number> {
    return this.httpClient.get<number>(`${this.url}/revenue-current-month`);
  }

  //
  public getAllYears(): Observable<number[]> {
    return this.httpClient.get<number[]>(`${this.url}/all-years`);
  }

  //
  public getRevenueOfMonthsByYear(year: number): Observable<Statistics[]> {
    return this.httpClient.get<Statistics[]>(
      `${this.url}/revenue-by-month/${year}`
    );
  }
}
