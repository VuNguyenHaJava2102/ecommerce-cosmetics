import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { Category } from 'src/app/model/class/model.class';
import { CategoryService } from 'src/app/service/category.service';
import { PageService } from 'src/app/service/page.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent {
  public categories: Category[];
  public totalCategories: number;

  public categoryMatTable: MatTableDataSource<Category>;
  public columns: string[] = ['id', 'name', 'update', 'delete'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public editForm: FormGroup;

  // constructor, ngOn
  constructor(
    private toastr: ToastrService,
    private pageService: PageService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.pageService.setActivePage('category');
    this.getCategories();
    this.initUpdateForm();
  }

  // public functions
  // 1
  public search(event: any): void {
    const value = (event.target as HTMLInputElement).value;
    this.categoryMatTable.filter = value.trim().toLowerCase();
  }

  // 2
  public reloadList(): void {
    this.ngOnInit();
  }

  // 3
  public delete(id: number, name: string): void {
    Swal.fire({
      title: 'Bạn muốn xoá loại sản phẩm: ' + name + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Không',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteById(id).subscribe(
          () => {
            this.toastr.success('Xóa thành công', 'Hệ thống');
            this.ngOnInit();
          },
          (errorResponse: HttpErrorResponse) => {
            this.toastr.error(
              'Xóa thất bại, loại sản phẩm này có thể không được xóa',
              'Hệ thống'
            );
          }
        );
      }
    });
  }

  // 4
  public openUpdateModal(id: number): void {
    this.categoryService.getById(id).subscribe((data: Category) => {
      this.editForm = new FormGroup({
        id: new FormControl(id),
        name: new FormControl(data.name, [
          Validators.minLength(2),
          Validators.required,
        ]),
        status: new FormControl(data.status),
      });
    });
  }

  // 5
  public update(): void {
    const category = this.editForm.value;
    this.categoryService.update(category).subscribe(
      (data: Category) => {
        this.toastr.success('Sửa thành công', 'Hệ thống');
        document.getElementById('closeBtnEdit').click();

        // reset update customer form
        this.initUpdateForm();
        this.ngOnInit();
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.message, 'Hệ thống');
      }
    );
  }

  // private functions
  // 1
  public getCategories(): void {
    this.categoryService.getAllStatusTrue().subscribe(
      (data: Category[]) => {
        this.categories = data;
        this.categoryMatTable = new MatTableDataSource(this.categories);
        this.categoryMatTable.sort = this.sort;
        this.categoryMatTable.paginator = this.paginator;
        this.totalCategories = data.length;
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.message, 'Hệ thống');
      }
    );
  }

  private initUpdateForm(): void {
    this.editForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl(null, [
        Validators.minLength(2),
        Validators.required,
      ]),
      status: new FormControl(null),
    });
  }
}
