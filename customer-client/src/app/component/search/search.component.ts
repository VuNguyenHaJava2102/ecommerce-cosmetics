import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { Category } from 'src/app/model/class/category.class';
import { Product } from 'src/app/model/class/product.class';
import { ProductService } from 'src/app/service/product.service';
import { Rating } from 'src/app/model/class/rating.class';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { FavouriteItemService } from 'src/app/service/favourite-item.service';
import { FavouriteItem } from 'src/app/model/class/favourite-item.class';
import { CategoryService } from 'src/app/service/category.service';
import { RateService } from 'src/app/service/rate.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  public isLoading = true;
  public reverse = true;
  public ratingCount = 0;
  public page = 1;
  public key: string = '';
  public keyF: string = '';
  public keyword: string;
  public products: Product[] = [];
  public categories: Category[] = [];
  public ratings: Rating[] = [];

  // constructor
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private productService: ProductService,
    private authenticationService: AuthenticationService,
    private favouriteItemService: FavouriteItemService,
    private categoryService: CategoryService,
    private ratingService: RateService
  ) {}

  ngOnInit(): void {
    this.getActiveProducts();
    this.getAllCategories();
    this.getAllRatings();
  }

  // private functions
  // 1
  private getActiveProducts(): void {
    this.productService.getActiveProducts().subscribe(
      (data: Product[]) => {
        this.isLoading = false;
        this.products = data;
        this.products = this.products.filter(
          (p) =>
            p.name.toLowerCase().includes(this.keyword.toLowerCase()) ||
            p.price * (1 - p.discount / 100) == Number(this.keyword)
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

  // 2
  private getAllCategories(): void {
    this.categoryService.getAll().subscribe((data: Category[]) => {
      this.categories = data;
    });
  }

  // 3
  private getAllRatings(): void {
    this.ratingService.getAllOrderById().subscribe((data: Rating[]) => {
      this.ratings = data;
    });
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
      this.getActiveProducts();
    }
  }

  // 2
  public getAvgRatingOfProduct(id: number): number {
    let avgRating: number = 0;
    this.ratingCount = 0;
    for (const item of this.ratings) {
      if (item.product.id === id) {
        avgRating += item.ratingPoint;
        this.ratingCount++;
      }
    }
    return Math.round((avgRating / this.ratingCount) * 10) / 10;
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
