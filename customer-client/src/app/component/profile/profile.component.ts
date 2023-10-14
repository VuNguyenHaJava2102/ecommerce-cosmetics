import { Component } from '@angular/core';
import { Order } from 'src/app/model/class/order.class';
import { HttpErrorResponse } from '@angular/common/http';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

import { User } from 'src/app/model/class/user.class';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { OrderService } from 'src/app/service/order.service';
import { OrderItem } from 'src/app/model/class/order-item.class';
import { OrderItemService } from 'src/app/service/order-item.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  public page: number = 1;
  public loggedUser: User;
  public totalCompletedOrders: number = 0;
  public selectedOrder: Order;
  public orders: Order[] = [];
  public orderItems: OrderItem[] = [];

  //
  constructor(
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private orderService: OrderService,
    private orderItemService: OrderItemService
  ) {}

  ngOnInit(): void {
    this.loggedUser = this.authenticationService.getUserFromStorage();
    this.countCompletedOrders();
  }

  // private functions
  //
  private countCompletedOrders(): void {
    this.orderService.getAllByUserId(this.loggedUser.id).subscribe(
      (data: Order[]) => {
        this.orders = data;
        this.totalCompletedOrders = 0;
        this.orders.forEach((o: Order) => {
          if (o.orderStatus === 'DELIVERED') {
            this.totalCompletedOrders += 1;
          }
        });
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
  public cancelOrder(id: number): void {
    if (id === -1) {
      return;
    }
    Swal.fire({
      title: 'Bạn có muốn huỷ đơn hàng này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonText: 'Không',
      confirmButtonText: 'Huỷ',
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.cancelOrder(id).subscribe(
          (data: Order) => {
            this.countCompletedOrders();
            this.toastr.success('Huỷ đơn hàng thành công!', 'Hệ thống');
          },
          (errorResponse: HttpErrorResponse) => {
            this.toastr.error(
              `Lỗi hệ thống: ${errorResponse.error.message}`,
              'Hệ thống'
            );
          }
        );
      }
    });
  }

  // 2
  public openModal(orderId: number): void {
    document.getElementById('openOrderDetailsBtn').click();
    this.orderService.getById(orderId).subscribe((data: Order) => {
      this.selectedOrder = data;
      this.orderItemService
        .getAllByOrderId(data.id)
        .subscribe((data: OrderItem[]) => {
          this.orderItems = data;
        });
    });
  }

  public finish(): void {
    this.ngOnInit();
  }
}
