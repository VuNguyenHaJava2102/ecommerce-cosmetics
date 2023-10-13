import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Chart, registerables } from 'chart.js';

import { Product } from 'src/app/model/class/product.class';
import { PageService } from 'src/app/service/page.service';
import { StatisticService } from 'src/app/service/statistic.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent {
  private products: Product[] = [];
  private labels: string[] = [];
  private data: number[] = [];
  private myChartBar: Chart;

  public productMatTable: MatTableDataSource<Product>;
  public totalProduct: number;
  public columns: string[] = [
    'image',
    'productId',
    'name',
    'quantity',
    'category',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // constructor
  constructor(
    private toastr: ToastrService,
    private pageService: PageService,
    private statisticService: StatisticService
  ) {}

  ngOnInit(): void {
    this.pageService.setActivePage('inventory');
    this.getInventory();
    Chart.register(...registerables);
  }

  // private functions
  private getInventory(): void {
    this.statisticService.getInventory().subscribe(
      (data: Product[]) => {
        this.products = data;
        this.productMatTable = new MatTableDataSource(data);
        this.productMatTable.sort = this.sort;
        this.productMatTable.paginator = this.paginator;

        for (let i = 0; i < 10; i++) {
          this.labels.push(data[i]?.name);
          this.data.push(data[i]?.quantity);
        }
        this.loadChartBar();
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(
          `Lỗi hệ thống: ${errorResponse.error.message}`,
          'Hệ thống'
        );
      }
    );
  }

  // 2
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
