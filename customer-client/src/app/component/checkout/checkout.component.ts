import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import Swal, { SweetAlertResult } from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

import { CartItem } from 'src/app/model/class/cart-item.class';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartItemService } from 'src/app/service/cart-item.service';
import { User } from 'src/app/model/class/user.class';
import { AddOrderRequest } from 'src/app/model/interface/add-order-request.interface';
import { OrderService } from 'src/app/service/order.service';
import { Order } from 'src/app/model/class/order.class';
import { NotificationService } from 'src/app/service/notification.service';
import { WebSocketService } from 'src/app/service/web-socket.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  public loggedUser: User;
  public discount: number;
  public realAmount: number;
  public checkoutAmount: number;
  public checkoutForm: FormGroup;
  public cartItems: CartItem[] = [];

  // constructor, ngOn
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private cartItemService: CartItemService,
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.discount = 0;
    this.realAmount = 0;
    this.checkoutAmount = 0;
    this.loggedUser = this.authenticationService.getUserFromStorage();
    this.getAllCartItems();
  }

  // public functions
  // 1
  public checkout(): void {
    if (this.checkoutForm.valid) {
      Swal.fire({
        title: 'Bạn có muốn đặt đơn hàng này?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Không',
        confirmButtonText: 'Đặt',
      }).then((result: SweetAlertResult) => {
        if (result.isConfirmed) {
          const cartItemIds: number[] = [];
          this.cartItems.forEach((item: CartItem) => cartItemIds.push(item.id));

          const address = `${this.checkoutForm.value.houseNumber}, ${this.checkoutForm.value.ward}, ${this.checkoutForm.value.district}, ${this.checkoutForm.value.province}`;
          const addOrderRequest: AddOrderRequest = {
            address: address,
            phone: this.checkoutForm.value.phone,
            userId: this.loggedUser.id,
            cartItemIds: cartItemIds,
          };

          this.orderService.addOrder(addOrderRequest).subscribe(
            (data: Order) => {
              Swal.fire(
                'Thành công!',
                'Bạn đã đặt hàng thành công.',
                'success'
              );
              this.sendMessage(data.orderCode);
              this.router.navigateByUrl('/cart-items');
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
    } else {
      this.toastr.error('Hãy nhập đầy đủ thông tin', 'Hệ thống');
    }
  }

  // private functions
  // 1
  private getAllCartItems(): void {
    this.checkoutForm = new FormGroup({
      phone: new FormControl(this.loggedUser.phone, [
        Validators.required,
        Validators.pattern('(0)[0-9]{9}'),
      ]),
      province: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      ward: new FormControl('', [Validators.required]),
      houseNumber: new FormControl('', Validators.required),
    });

    this.cartItemService
      .getCartItemsByUserId(this.loggedUser.id)
      .subscribe((data: CartItem[]) => {
        this.cartItems = data;
        this.cartItemService.setQuantity(data.length);
        if (data.length === 0) {
          this.router.navigateByUrl('/home');
          this.toastr.info(
            'Hãy chọn một vài sản phẩm rồi tiến hành thanh toán',
            'Hệ thống'
          );
        }
        this.cartItems.forEach((item: CartItem) => {
          this.realAmount += item.product.price * item.quantity;
          this.checkoutAmount += item.price;
        });
        this.discount = this.realAmount - this.checkoutAmount;
      });
  }

  // 2
  private sendMessage(orderCode: string): void {
    let messageContent = `${this.loggedUser.name} đã đặt một đơn hàng. Mã đơn: ${orderCode}`;
    this.notificationService.add(messageContent).subscribe(
      () => {},
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(
          `Lỗi hệ thống: ${errorResponse.error.message}`,
          'Hệ thống'
        );
      }
    );
  }
}
