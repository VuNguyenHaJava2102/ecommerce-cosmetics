import { Component, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Product } from 'src/app/model/class/product.class';
import { PageService } from 'src/app/service/page.service';
import { ProductService } from 'src/app/service/product.service';
import { CategoryService } from 'src/app/service/category.service';
import { Category } from 'src/app/model/class/model.class';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent {
  public productMatTable: MatTableDataSource<Product>;
  public totalProducts: number;
  public columns: string[] = [
    'image',
    'id',
    'name',
    'price',
    'discount',
    'category',
    'enteredDate',
    'update',
    'delete',
  ];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public editForm: FormGroup;
  public imageUrl = 'http://localhost:8080/product/image/default';
  public categories: Category[];
  private selectFile: File;

  // constructor, ngOn
  constructor(
    private toastr: ToastrService,
    private pageService: PageService,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.pageService.setActivePage('product');
    this.getAllProducts();
    this.initUpdateProductForm();
    this.getAllCategories();
  }

  // public functions
  // 1
  public search(event: any): void {
    const value = (event.target as HTMLInputElement).value;
    this.productMatTable.filter = value.trim().toLowerCase();
  }

  // 2
  public reloadList(): void {
    this.ngOnInit();
  }

  // 3
  public delete(id: number, name: string): void {
    Swal.fire({
      title: `Bạn muốn xoá sản phẩm: ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Không',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteById(id).subscribe(
          () => {
            this.ngOnInit();
            this.toastr.success('Xoá thành công!', 'Hệ thống');
          },
          () => {
            this.toastr.error(
              'Sản phẩm này hiện tại không thể xóa, hoặc hệ thống có lỗi!',
              'Hệ thống'
            );
          }
        );
      }
    });
  }

  // 4
  public openUpdateModal(id: number): void {
    this.productService.getById(id).subscribe((data: Product) => {
      this.editForm = new FormGroup({
        id: new FormControl(id),
        productCode: new FormControl(data.productCode),
        name: new FormControl(data.name, [
          Validators.minLength(4),
          Validators.required,
        ]),
        quantity: new FormControl(data.quantity, [
          Validators.min(1),
          Validators.required,
        ]),
        price: new FormControl(data.price, [
          Validators.required,
          Validators.min(1000),
        ]),
        discount: new FormControl(data.discount, [
          Validators.required,
          Validators.min(0),
          Validators.max(100),
        ]),
        description: new FormControl(data.description, Validators.required),
        enteredDate: new FormControl(data.enteredDate),
        active: new FormControl(data.active),
        sold: new FormControl(data.sold),
        categoryId: new FormControl(data.category.id),
      });
      this.imageUrl = data.imageUrl;
    });
  }

  // 5
  public imageChange(event: any): void {
    this.selectFile = event.target['files'][0];
    this.showImageThumbnail(this.selectFile);
  }

  // 6
  private showImageThumbnail(file: File): void {
    let reader = new FileReader();
    reader.onload = (e) => {
      (document.getElementById('editThumbnail') as HTMLImageElement)['src'] = e
        .target.result as string;
    };
    reader.readAsDataURL(file);
  }

  // 7
  public update(): void {
    const request = this.editForm.value;
    console.log(request);
    console.log(this.selectFile.name);

    this.productService.update(request, this.selectFile).subscribe(
      (data: Product) => {
        this.toastr.success(
          `Sửa thành công sản phẩm: ${data.name}`,
          'Hệ thống'
        );
        document.getElementById('closeBtnEdit').click();

        // reset update product form
        this.initUpdateProductForm();
        this.ngOnInit();
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.message, 'Hệ thống');
      }
    );
  }

  // private functions
  // 1
  private getAllProducts(): void {
    this.productService.getAllActive().subscribe(
      (data: Product[]) => {
        this.productMatTable = new MatTableDataSource(data);
        this.productMatTable.sort = this.sort;
        this.productMatTable.paginator = this.paginator;
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.message, 'Hệ thống');
      }
    );
  }

  // 2
  private initUpdateProductForm(): void {
    this.editForm = new FormGroup({
      id: new FormControl(0),
      productCode: new FormControl(null),
      name: new FormControl(null, [
        Validators.minLength(4),
        Validators.required,
      ]),
      quantity: new FormControl(null, [Validators.min(1), Validators.required]),
      price: new FormControl(null, [Validators.required, Validators.min(1000)]),
      discount: new FormControl(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
      description: new FormControl(null, Validators.required),
      enteredDate: new FormControl(new Date()),
      active: new FormControl(1),
      sold: new FormControl(0),
      categoryId: new FormControl(1),
    });
    this.imageUrl = 'http://localhost:8080/product/image/default';
  }

  private getAllCategories(): void {
    this.categoryService.getAllStatusTrue().subscribe(
      (data: Category[]) => {
        this.categories = data;
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.message, 'Hệ thống');
      }
    );
  }
}
