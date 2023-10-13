import { Component } from '@angular/core';

import { PageService } from 'src/app/service/page.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  public activePage: string = 'dashboard';

  constructor(private pageService: PageService) {}

  ngOnInit(): void {
    this.pageService.activePage.subscribe((data: string) => {
      this.activePage = data;
    });
  }
}
