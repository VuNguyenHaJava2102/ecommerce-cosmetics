import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthenticationService } from 'src/app/service/authentication.service';
import { FavouriteItemService } from 'src/app/service/favourite-item.service';
import { FavouriteItem } from 'src/app/model/class/favourite-item.class';
import { CartItem } from 'src/app/model/class/cart-item.class';
import { CartItemService } from 'src/app/service/cart-item.service';
import { CategoryService } from 'src/app/service/category.service';
import { Category } from 'src/app/model/class/category.class';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  public isLoggedIn = false;
  public totalFavouriteItems = 0;
  public totalCartItems = 0;
  public favouriteItems: FavouriteItem[];
  public cartItems: CartItem[];
  public categories: Category[];

  // constructor, ngOn
  constructor(
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private favouriteItemService: FavouriteItemService,
    private cartItemService: CartItemService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.favouriteItemService.totalFavouriteItems.subscribe((data: number) => {
      this.totalFavouriteItems = data;
    });
    this.cartItemService.totalCartItems.subscribe((data: number) => {
      this.totalCartItems = data;
    });
    this.isLoggedIn = this.authenticationService.isUserLoggedIn();
    this.getAllCategories();

    if (this.isLoggedIn) {
      this.getFavouriteItems();
      this.getCartItems();
    }
  }

  // public functions
  // 1
  public logout(): void {
    this.authenticationService.logout();
    this.toastr.success('Đăng xuất thành công!', 'Hệ thống');
    setTimeout(() => {
      window.location.href = '/home';
    }, 1000);
  }

  // private functions
  // 1
  private getFavouriteItems(): void {
    const loggedUser = this.authenticationService.getUserFromStorage();
    if (loggedUser === null) {
      return;
    }
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

  // 2
  private getCartItems(): void {
    const loggedUser = this.authenticationService.getUserFromStorage();
    if (loggedUser === null) {
      return;
    }
    this.cartItemService.getCartItemsByUserId(loggedUser.id).subscribe(
      (data: CartItem[]) => {
        this.cartItems = data;
        this.cartItemService.setQuantity(data.length);
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(
          `Lỗi hệ thống: ${errorResponse.error.message}`,
          'Hệ thống'
        );
      }
    );
  }

  // 4
  private getAllCategories(): void {
    this.categoryService.getAll().subscribe(
      (data: Category[]) => {
        this.categories = data;
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
