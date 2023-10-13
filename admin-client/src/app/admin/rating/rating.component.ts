import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import Swal, { SweetAlertResult } from 'sweetalert2';

import { Rating } from 'src/app/model/class/rating.class';
import { RatingService } from 'src/app/service/rating.service';
import { PageService } from 'src/app/service/page.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
})
export class RatingComponent {
  public ratings: Rating[];
  public ratingMatTable: MatTableDataSource<Rating>;
  public totalRating: number;
  public columns: string[] = [
    'index',
    'name',
    'product',
    'rating',
    'comment',
    'rateDate',
    'delete',
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // constructor, ngOn
  constructor(
    private toastr: ToastrService,
    private ratingService: RatingService,
    private pageService: PageService
  ) {}

  ngOnInit(): void {
    this.pageService.setActivePage('rating');
    this.getAllRatings();
  }

  // private functions
  // 1
  private getAllRatings(): void {
    this.ratingService.getAllOrderById().subscribe(
      (data: Rating[]) => {
        this.ratings = data;
        this.ratingMatTable = new MatTableDataSource(this.ratings);
        this.ratingMatTable.sort = this.sort;
        this.ratingMatTable.paginator = this.paginator;
        this.totalRating = data.length;
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
  public delete(id: number) {
    Swal.fire({
      title: 'Bạn muốn xoá đánh giá này ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Không',
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        this.ratingService.deleteById(id).subscribe(
          () => {
            this.toastr.success('Xoá thành công!', 'Hệ thống');
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
  public search(event: any): void {
    const fValue = (event.target as HTMLInputElement).value;
    this.ratingService.getAllOrderById().subscribe((data: Rating[]) => {
      this.ratings = data;
      this.ratings = this.ratings.filter(
        (rating: Rating) =>
          rating.user.name.toLowerCase().includes(fValue.toLowerCase()) ||
          rating.product.name.toLowerCase().includes(fValue.toLowerCase()) ||
          rating.comment.toLowerCase().includes(fValue.toLowerCase())
      );
      this.ratingMatTable = new MatTableDataSource(this.ratings);
      this.ratingMatTable.sort = this.sort;
      this.ratingMatTable.paginator = this.paginator;
      this.totalRating = this.ratings.length;
    });
  }
}
