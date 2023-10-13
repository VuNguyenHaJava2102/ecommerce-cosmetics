import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import Swal, { SweetAlertResult } from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

import { CartItem } from 'src/app/model/class/cart-item.class';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartItemService } from 'src/app/service/cart-item.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  public cartItems: CartItem[] = [];
  public realAmount: number;
  public discount: number;
  public amount: number;

  //
  constructor(
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private cartItemService: CartItemService
  ) {}

  ngOnInit(): void {
    this.realAmount = 0;
    this.discount = 0;
    this.amount = 0;
    this.getAllCartItems();
  }

  // private functions
  // 1
  private getAllCartItems(): void {
    let loggedUser = this.authenticationService.getUserFromStorage();
    this.cartItemService
      .getCartItemsByUserId(loggedUser.id)
      .subscribe((data: CartItem[]) => {
        this.cartItems = data;
        this.cartItemService.setQuantity(data.length);
        this.cartItems.forEach((item: CartItem) => {
          this.realAmount += item.product.price * item.quantity;
          this.amount += item.price;
        });
        this.discount = this.amount - this.realAmount;
      });
  }

  // public functions
  // 1
  public deleteFromCart(id: number): void {
    Swal.fire({
      title: 'Bạn muốn xoá sản phẩm này ra khỏi giỏ hàng?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Không',
      confirmButtonText: 'Xoá',
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        this.cartItemService.deleteById(id).subscribe(
          () => {
            this.toastr.success('Xoá khỏi giỏ hàng   thành công!', 'Hệ thống');
            this.ngOnInit();
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
  public update(itemId: number, quantity: number): void {
    if (quantity < 1) {
      this.deleteFromCart(itemId);
    } else {
      this.cartItemService.updateQuantityById(itemId, quantity).subscribe(
        () => {
          this.ngOnInit();
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
}
