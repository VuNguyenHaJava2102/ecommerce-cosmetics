import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { Product } from 'src/app/model/class/product.class';
import { Rating } from 'src/app/model/class/rating.class';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { ProductService } from 'src/app/service/product.service';
import { RateService } from 'src/app/service/rate.service';
import { CartItem } from 'src/app/model/class/cart-item.class';
import { CartItemService } from 'src/app/service/cart-item.service';
import { FavouriteItemService } from 'src/app/service/favourite-item.service';
import { FavouriteItem } from 'src/app/model/class/favourite-item.class';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent {
  public isLoading = true;
  public countRate: number;
  public ratedProducts: Product[] = [];
  public bestSellerProducts: Product[] = [];
  public newestProducts: Product[] = [];
  public bestRatingProducts: Product[] = [];

  public ratings: Rating[] = [];
  public slideConfig = { slidesToShow: 7, slidesToScroll: 2, autoplay: true };

  // constructor, ngOn
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private productService: ProductService,
    private rateService: RateService,
    private cartService: CartItemService,
    private favouriteItemService: FavouriteItemService
  ) {}

  ngOnInit(): void {
    this.getAllRatingsOrderById();
    this.getBestSellerProducts();
    this.getAllNewestProducts();
    this.getBestRatingProducts();
  }

  // private functions
  // 1
  private getAllRatingsOrderById(): void {
    this.rateService.getAllOrderById().subscribe((data: Rating[]) => {
      this.ratings = data;
    });
  }

  // 2
  private getBestSellerProducts(): void {
    this.productService.getBestSellerProducts().subscribe(
      (data: Product[]) => {
        this.bestSellerProducts = data;
        this.isLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(
          `Hệ thống gặp lỗi! Chi tiết: ${errorResponse.error.message}`,
          'Hệ thống'
        );
      }
    );
  }

  // 3
  private getAllNewestProducts(): void {
    this.productService.getNewestProducts().subscribe(
      (data: Product[]) => {
        this.newestProducts = data;
        this.isLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(
          `Hệ thống gặp lỗi! Chi tiết: ${errorResponse.error.message}`,
          'Hệ thống'
        );
      }
    );
  }

  // 4
  private getBestRatingProducts(): void {
    this.productService.getBestRatingProducts().subscribe(
      (data: Product[]) => {
        this.bestRatingProducts = data;
        this.isLoading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(
          `Hệ thống gặp lỗi! Chi tiết: ${errorResponse.error.message}`,
          'Hệ thống'
        );
      }
    );
  }

  // public functions
  // 1
  public getAvgRatingOfProduct(productId: number): number {
    let totalRating: number = 0;
    this.countRate = 0;
    for (const rating of this.ratings) {
      if (rating.product.id === productId) {
        totalRating += rating.ratingPoint;
        this.countRate++;
      }
    }
    return Math.round((totalRating / this.countRate) * 10) / 10;
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
}
