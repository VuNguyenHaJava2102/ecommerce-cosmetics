import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Chart, registerables } from 'chart.js';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Product } from 'src/app/model/class/product.class';
import { PageService } from 'src/app/service/page.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-best-seller',
  templateUrl: './best-seller.component.html',
  styleUrls: ['./best-seller.component.css'],
})
export class BestSellerComponent {
  public productMatTable: MatTableDataSource<Product>;
  public totalProduct: number;
  public columns: string[] = ['image', 'productId', 'name', 'sold', 'category'];

  private labels: string[] = [];
  private data: number[] = [];
  private myChartBar: Chart;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // constructor, ngOn
  constructor(
    private toastr: ToastrService,
    private pageService: PageService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.pageService.setActivePage('best-seller');
    this.getProducts();
    Chart.register(...registerables);
  }

  private getProducts(): void {
    this.productService.getTop10BestSeller().subscribe(
      (data: Product[]) => {
        this.productMatTable = new MatTableDataSource(data);
        this.productMatTable.sort = this.sort;
        this.productMatTable.paginator = this.paginator;

        for (let i = 0; i < 3; i++) {
          this.labels.push(data[i]?.name);
          this.data.push(data[i]?.sold);
        }
        for (let i = 3; i < 6; i++) {
          this.labels.push(data[i]?.name);
          this.data.push(data[i]?.sold);
        }
        for (let i = 9; i >= 6; i--) {
          this.labels.push(data[i]?.name);
          this.data.push(data[i]?.sold);
        }
        this.loadChartBar();
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.message, 'Hệ thống');
      }
    );
  }

  private loadChartBar(): void {
    this.myChartBar = new Chart('chart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(201, 203, 207, 0.2)',
              'rgba(0, 162, 71, 0.2)',
              'rgba(82, 0, 36, 0.2)',
              'rgba(82, 164, 36, 0.2)',
              'rgba(255, 158, 146, 0.2)',
              'rgba(123, 39, 56, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(201, 203, 207, 1)',
              'rgba(0, 162, 71, 1)',
              'rgba(82, 0, 36, 1)',
              'rgba(82, 164, 36, 1)',
              'rgba(255, 158, 146, 1)',
              'rgba(123, 39, 56, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }
}
