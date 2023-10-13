import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js';

import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/model/class/customer.class';

import { Order } from 'src/app/model/class/order.class';
import { Statistics } from 'src/app/model/class/statistics.class';
import { CustomerService } from 'src/app/service/customer.service';
import { OrderService } from 'src/app/service/order.service';
import { PageService } from 'src/app/service/page.service';
import { StatisticService } from 'src/app/service/statistic.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  private orders: Order[] = [];
  private year: number = 2023;
  private labels: string[] = [];
  private data: number[] = [];
  private myChartBar: Chart;

  public totalUnhandledOrder: number;
  public totalCustomer: number;
  public revenueCurrentYear: number;
  public revenueCurrentMonth: number;
  public years: number[] = [];

  // constructor, ngOn
  constructor(
    private pageService: PageService,
    private toastr: ToastrService,
    private orderService: OrderService,
    private customerService: CustomerService,
    private statisticService: StatisticService
  ) {}

  ngOnInit(): void {
    this.pageService.setActivePage('dashboard');
    this.getAllOrders();
    this.getAllCustomers();
    this.getRevenueOfCurrentYear();
    this.getRevenueOfCurrentMonth();
    this.getRevenueOfMonthsByYear();
    this.getAllYears();
    Chart.register(...registerables);
  }

  // private functions
  // 1
  private getAllOrders(): void {
    this.orderService.getAllOrders().subscribe(
      (data: Order[]) => {
        this.orders = data;
        this.totalUnhandledOrder = 0;

        // calculate total unhandled orders
        for (let i = 0; i < data.length; i++) {
          if (data[i].orderStatus === 'ORDERED') {
            this.totalUnhandledOrder++;
          }
        }
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.message, 'Hệ thống');
      }
    );
  }

  // 2
  private getAllCustomers(): void {
    this.customerService.getAll().subscribe(
      (data: Customer[]) => {
        this.totalCustomer = data.length;
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.message, 'Hệ thống');
      }
    );
  }

  // 3
  private getRevenueOfCurrentYear(): void {
    this.statisticService.getRevenueOfCurrentYear().subscribe(
      (data: number) => {
        this.revenueCurrentYear = data;
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.message, 'Hệ thống');
      }
    );
  }

  // 4
  private getRevenueOfCurrentMonth(): void {
    this.statisticService.getRevenueOfCurrentMonth().subscribe(
      (data: number) => {
        this.revenueCurrentMonth = data;
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.message, 'Hệ thống');
      }
    );
  }

  // 3
  private getRevenueOfMonthsByYear(): void {
    this.statisticService.getRevenueOfMonthsByYear(this.year).subscribe(
      (data: Statistics[]) => {
        data.forEach((item: Statistics) => {
          this.labels.push(`Tháng ${item.monthOfYear}`);
          this.data.push(item.totalRevenue);
        });
        this.loadChartBar();
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.message, 'Hệ thống');
      }
    );
  }

  //
  private getAllYears(): void {
    this.statisticService.getAllYears().subscribe(
      (data: number[]) => {
        this.years = data;
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.message, 'Hệ thống');
      }
    );
  }

  //
  private loadChartBar(): void {
    this.myChartBar = new Chart('chart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            // label: '# of Votes',
            data: this.data,
            // borderColor: 'rgb(75, 192, 192)',
            // pointBorderColor: 'rgba(54, 162, 235, 0.2)',
            // backgroundColor: 'rgba(255, 99, 132, 0.2)',
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

  // public functions
  // 1
  public getRevenueByYear(year: number): number {
    let revenue = 0;
    for (let i = 0; i < this.orders.length; i++) {
      if (
        new Date(this.orders[i].orderTime).getFullYear() === year &&
        this.orders[i].orderStatus === 'DELIVERED'
      ) {
        revenue += this.orders[i].checkoutAmount;
      }
    }
    return revenue;
  }

  // 2
  public setYear(year: number): void {
    this.year = year;
    this.labels = [];
    this.data = [];
    this.myChartBar.destroy();
    this.ngOnInit();
  }
}
