import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { Category } from 'src/app/model/class/category.class';
import { Product } from 'src/app/model/class/product.class';
import { Rating } from 'src/app/model/class/rating.class';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';
import { RateService } from 'src/app/service/rate.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartItem } from 'src/app/model/class/cart-item.class';
import { CartItemService } from 'src/app/service/cart-item.service';
import { FavouriteItemService } from 'src/app/service/favourite-item.service';
import { FavouriteItem } from 'src/app/model/class/favourite-item.class';

@Component({
  selector: 'app-by-category',
  templateUrl: './by-category.component.html',
  styleUrls: ['./by-category.component.css'],
})
export class ByCategoryComponent {
  private categoryId: number;
  public isLoading = true;
  public page = 1;
  public ratingCount: number;
  public key = '';
  public keyF = '';
  public reverse = true;
  public categories: Category[] = [];
  public ratings: Rating[] = [];
  public products: Product[] = [];

  // constructor
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private categoryService: CategoryService,
    private ratingService: RateService,
    private productService: ProductService,
    private authenticationService: AuthenticationService,
    private cartService: CartItemService,
    private favouriteItemService: FavouriteItemService
  ) {
    this.activatedRoute.params.subscribe(() => {
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.categoryId = this.activatedRoute.snapshot.params['id'];
    this.getAllCategories();
    this.getAllRatings();
    this.getProductsByCategory();
  }

  // private functions
  // 1
  private getAllCategories(): void {
    this.categoryService.getAll().subscribe((data: Category[]) => {
      this.categories = data;
    });
  }

  // 2
  private getAllRatings(): void {
    this.ratingService.getAllOrderById().subscribe((data: Rating[]) => {
      this.ratings = data;
    });
  }

  // 3
  private getProductsByCategory(): void {
    this.productService.getProductsByCategoryId(this.categoryId).subscribe(
      (data: Product[]) => {
        this.isLoading = false;
        this.products = data;
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(
          `Lỗi hệ thống: ${errorResponse.error.message}`,
          'Hệ thống'
        );
        this.router.navigateByUrl('/home');
      }
    );
  }

  // public functions
  // 1
  public sort(keyF: string): void {
    if (keyF === 'enteredDate') {
      this.key = 'enteredDate';
      this.reverse = true;
    } else if (keyF === 'priceDesc') {
      this.key = '';
      this.products.sort((a, b) => b.price - a.price);
    } else if (keyF === 'priceAsc') {
      this.key = '';
      this.products.sort((a, b) => a.price - b.price);
    } else {
      this.key = '';
      this.getProductsByCategory();
    }
  }

  // 2
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

    this.cartService.addNewCartItem(newCartItem).subscribe(
      (data: CartItem) => {
        this.toastr.success('Thêm vào giỏ hàng thành công!', 'Hệ thống!');
        this.cartService
          .getCartItemsByUserId(loggedUser.id)
          .subscribe((data: CartItem[]) => {
            this.cartService.setQuantity(data.length);
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

  // 3
  public toggleLike(productId: number): void {
    let loggedUser = this.authenticationService.getUserFromStorage();
    if (loggedUser == null) {
      this.router.navigate(['/sign-form']);
      this.toastr.info(
        'Hãy đăng nhập để sử dụng dịch vụ của chúng tôi',
        'Hệ thống'
      );
      return;
    }

    this.favouriteItemService
      .getByUserIdAndProductId(loggedUser.id, productId)
      .subscribe((item: FavouriteItem) => {
        if (item == null) {
          // chưa có trong danh sách và thêm
          this.favouriteItemService
            .saveByUserIdAndProductId(loggedUser.id, productId)
            .subscribe(
              () => {
                this.toastr.success(
                  'Thêm vào danh sách yêu thích thành công!',
                  'Hệ thống'
                );
                this.favouriteItemService.getByUser(loggedUser.id).subscribe(
                  (data: FavouriteItem[]) => {
                    this.favouriteItemService.setQuantity(data.length);
                  },
                  (errorResponse: HttpErrorResponse) => {
                    this.toastr.error(
                      `Lỗi hệ thống: ${errorResponse.error.message}`,
                      'Hệ thống'
                    );
                  }
                );
              },
              (errorResponse: HttpErrorResponse) => {
                this.toastr.error(
                  `Lỗi hệ thống: ${errorResponse.error.message}`,
                  'Hệ thống'
                );
              }
            );
        } else if (item != null) {
          // đã có trong danh sách và xóa
          const itemId = item.id;
          this.favouriteItemService.deleteById(itemId).subscribe(
            () => {
              this.toastr.info(
                'Đã xoá sản phẩm ra khỏi danh sách yêu thích!',
                'Hệ thống'
              );
              this.favouriteItemService.getByUser(loggedUser.id).subscribe(
                (data) => {
                  this.favouriteItemService.setQuantity(data.length);
                },
                (errorResponse: HttpErrorResponse) => {
                  this.toastr.error(
                    `Lỗi hệ thống: ${errorResponse.error.message}`,
                    'Hệ thống'
                  );
                }
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
      });
  }

  // 4
  public getAvgRatingOfProduct(productId: number): number {
    let totalRating: number = 0;
    this.ratingCount = 0;
    for (const rating of this.ratings) {
      if (rating.product.id === productId) {
        totalRating += rating.ratingPoint;
        this.ratingCount++;
      }
    }
    return Math.round((totalRating / this.ratingCount) * 10) / 10;
  }
}
