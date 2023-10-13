import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { Product } from 'src/app/model/class/product.class';
import { ProductService } from 'src/app/service/product.service';
import { RateService } from 'src/app/service/rate.service';
import { Rating } from 'src/app/model/class/rating.class';
import { FavouriteItemService } from 'src/app/service/favourite-item.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { CartItemService } from 'src/app/service/cart-item.service';
import { CartItem } from 'src/app/model/class/cart-item.class';
import { FavouriteItem } from 'src/app/model/class/favourite-item.class';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent {
  private productId: number;
  public totalLike: number;
  public ratingCount: number;
  public itemsComment: number = 3;
  public isLoading = true;
  public product: Product;
  public ratingsOfProduct: Rating[] = [];
  public ratings: Rating[] = [];
  public products: Product[] = [];
  public slideConfig = { slidesToShow: 7, slidesToScroll: 2, autoplay: true };

  // constructor, ngOn
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private productService: ProductService,
    private ratingService: RateService,
    private favouriteItemService: FavouriteItemService,
    private authenticationService: AuthenticationService,
    private cartItemService: CartItemService
  ) {}

  ngOnInit(): void {
    this.productId = this.activatedRoute.snapshot.params['id'];
    this.getProductById();
    this.getRatingsByProduct();
    this.getAllRatings();
    this.countTotalLikeByProduct();
  }

  // private functions
  // 1
  private getProductById(): void {
    this.productService.getProductById(this.productId).subscribe(
      (data: Product) => {
        this.isLoading = false;
        this.product = data;
        this.productService
          .getRelatedProducts(this.product.category.id, this.product.id)
          .subscribe((data: Product[]) => {
            this.products = data;
          });
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

  // 2
  private getRatingsByProduct(): void {
    this.ratingService.getRatingByProduct(this.productId).subscribe(
      (data: Rating[]) => {
        this.ratingsOfProduct = data;
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
  private getAllRatings(): void {
    this.ratingService.getAllOrderById().subscribe((data: Rating[]) => {
      this.ratings = data;
    });
  }

  // 4
  private countTotalLikeByProduct(): void {
    this.favouriteItemService.countTotalLikeByProduct(this.productId).subscribe(
      (data: number) => {
        this.totalLike = data;
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
  public getAvgRatingOfProduct(productId: number): number {
    let totalRatingPoint: number = 0;
    this.ratingCount = 0;
    for (const rating of this.ratings) {
      if (rating.product.id == productId) {
        totalRatingPoint += rating.ratingPoint;
        this.ratingCount++;
      }
    }
    return Math.round((totalRatingPoint / this.ratingCount) * 10) / 10;
  }

  // 2
  public setQuantityOfComment(quantity: number): void {
    this.getProductById();
    this.getAllRatings();
    this.countTotalLikeByProduct();
    this.getRatingsByProduct();
    this.itemsComment = quantity;
  }

  // 3
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

  // 4
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
                this.countTotalLikeByProduct();
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
              this.countTotalLikeByProduct();
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
