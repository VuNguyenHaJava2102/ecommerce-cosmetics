import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageService {
  public activePage = new BehaviorSubject<string>('dashboard');

  constructor() {}

  public setActivePage(activePage: string): void {
    this.activePage.next(activePage);
  }
}
