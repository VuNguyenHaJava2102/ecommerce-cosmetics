import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import Swal, { SweetAlertResult } from 'sweetalert2';

import { FavouriteItem } from 'src/app/model/class/favourite-item.class';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { FavouriteItemService } from 'src/app/service/favourite-item.service';
import { CartItemService } from 'src/app/service/cart-item.service';
import { CartItem } from 'src/app/model/class/cart-item.class';

@Component({
  selector: 'app-favourite-items',
  templateUrl: './favourite-items.component.html',
  styleUrls: ['./favourite-items.component.css'],
})
export class FavouriteItemsComponent {
  public favouriteItems: FavouriteItem[] = [];
  public page = 1;

  // constructor
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private favouriteItemService: FavouriteItemService,
    private cartItemService: CartItemService
  ) {}

  ngOnInit(): void {
    console.log('hello');

    this.getAllFavouriteItems();
  }

  // private functions
  // 1
  private getAllFavouriteItems(): void {
    let loggedUser = this.authenticationService.getUserFromStorage();
    this.favouriteItemService.getByUser(loggedUser.id).subscribe(
      (data: FavouriteItem[]) => {
        this.favouriteItems = data;
        this.favouriteItemService.setQuantity(data.length);
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
  public addNewCartItem(productId: number, price: number): void {
    let loggedUser = this.authenticationService.getUserFromStorage();
    if (loggedUser == null) {
      this.router.navigate(['/sign-form']);
      this.toastr.info(
        'Hãy đăng nhập để sử dụng dịch vụ của chúng tôi',
        'Hệ thống'
      );
      return;
    }

    const newCartItem = {
      id: 0,
      quantity: 1,
      price: price,
      productId: productId,
      userId: loggedUser.id,
    };

    this.cartItemService.addNewCartItem(newCartItem).subscribe(
      (data: CartItem) => {
        this.toastr.success('Thêm vào giỏ hàng thành công!', 'Hệ thống!');
        this.cartItemService
          .getCartItemsByUserId(loggedUser.id)
          .subscribe((data: CartItem[]) => {
            this.cartItemService.setQuantity(data.length);
          });
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(
          `Thêm sản phẩm vào giỏ hàng thất bại. Lỗi: ${errorResponse.error.message}`,
          'Hệ thống'
        );
      }
    );
  }

  // 2
  public deleteFromFavouriteList(itemId: number, productName: string): void {
    Swal.fire({
      title: `Bạn muốn xoá sản phẩm ${productName} ra khỏi danh sách yêu thích ?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Không',
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        this.favouriteItemService.deleteById(itemId).subscribe(
          () => {
            this.toastr.info(
              `Đã xoá ${productName} ra khỏi danh sách yêu thích!`,
              'Hệ thống'
            );
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
}
