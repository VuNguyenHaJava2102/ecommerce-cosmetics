import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

import { Order } from 'src/app/model/class/order.class';
import { OrderService } from 'src/app/service/order.service';
import { OrderItem } from 'src/app/model/class/order-item.class';
import { PageService } from 'src/app/service/page.service';
import { OrderItemService } from 'src/app/service/order-item.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent {
  public orderMatTable: MatTableDataSource<Order>;
  public orders: Order[] = [];
  public totalOrder: number;
  public columns: string[] = [
    'id',
    'user',
    'address',
    'phone',
    'amount',
    'orderDate',
    'status',
    'view',
  ];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // order details
  public selectedOrder: Order;
  public orderItems: OrderItem[] = [];
  public totalOrderItem: number;
  public orderItemMatTable: MatTableDataSource<OrderItem>;
  public orderItemColumns: string[] = [
    'index',
    'image',
    'product',
    'quantity',
    'price',
  ];

  // constructor, ngOn
  constructor(
    private toastr: ToastrService,
    private pageService: PageService,
    private orderService: OrderService,
    private orderItemService: OrderItemService
  ) {}

  ngOnInit(): void {
    this.pageService.setActivePage('order');
    this.getAllOrders();
  }

  // private functions
  // 1
  private getAllOrders(): void {
    this.orderService.getAllOrders().subscribe(
      (data: Order[]) => {
        this.orders = data;
        this.orderMatTable = new MatTableDataSource(this.orders);
        this.orderMatTable.sort = this.sort;
        this.orderMatTable.paginator = this.paginator;
        this.totalOrder = this.orders.length;
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(
          `Lỗi hệ thống: ${errorResponse.error.message}`,
          'Hệ thống'
        );
      }
    );
  }

  // public functions
  // 1
  public search(event: any): void {
    const fValue = (event.target as HTMLInputElement).value;
    this.orderService.getAllOrders().subscribe((data: Order[]) => {
      this.orders = data;
      this.orders = this.orders.filter(
        (order: Order) =>
          // order.user.name.toLowerCase().includes(fValue.toLowerCase()) ||
          // order.ordersId === Number(fValue) ||
          order.address.toLowerCase().includes(fValue.toLowerCase()) ||
          order.phone.includes(fValue.toLowerCase())
      );
      this.orderMatTable = new MatTableDataSource(this.orders);
      this.orderMatTable.sort = this.sort;
      this.orderMatTable.paginator = this.paginator;
      this.totalOrder = this.orders.length;
    });
  }

  // 2
  public openOrderItemsModal(orderId: number): void {
    this.orderService.getById(orderId).subscribe((data: Order) => {
      this.selectedOrder = data;
    });

    this.orderItemService.getByOrder(orderId).subscribe(
      (data: OrderItem[]) => {
        this.orderItems = data;
        this.orderItemMatTable = new MatTableDataSource(data);
        this.totalOrderItem = data.length;
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(
          `Lỗi hệ thống: ${errorResponse.error.message}`,
          'Hệ thống'
        );
      }
    );
  }

  // 3
  public updateOrderStatus(event: any): void {
    if (this.selectedOrder == null) {
      return;
    }
    const value = (event.target as HTMLSelectElement).value;
    this.orderService.updateOrderStatus(this.selectedOrder.id, value).subscribe(
      (data: Order) => {
        this.getAllOrders();
        this.toastr.success(
          `Đơn hàng ${data.orderCode} đã được cập nhật trạng thái`,
          'Hệ thống'
        );
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(
          `Lỗi hệ thống: ${errorResponse.error.message}`,
          'Hệ thống'
        );
      }
    );
  }
}
