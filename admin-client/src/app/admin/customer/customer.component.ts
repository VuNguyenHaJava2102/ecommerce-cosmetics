import { Component, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { CustomerService } from 'src/app/service/customer.service';
import { PageService } from 'src/app/service/page.service';
import { Customer } from 'src/app/model/class/customer.class';
import { UpdateCustomerRequest } from 'src/app/model/interface/update-customer-request.interface';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent {
  public customers: Customer[];
  public customerLength: number;

  public customerMatTable: MatTableDataSource<Customer>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public columns: string[] = [
    'image',
    'id',
    'name',
    'email',
    'address',
    'phone',
    'gender',
    'registerDate',
    'update',
    'delete',
  ];

  private selectFile: File;
  public editForm: FormGroup;
  public imageUrl = 'http://localhost:8080/user/image/default';

  // constructor, ngOn
  constructor(
    private toastr: ToastrService,
    private pageService: PageService,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    this.pageService.setActivePage('customer');
    this.getAllCustomers();
    this.initUpdateCustomerForm();
  }

  // private functions
  // 1
  private getAllCustomers(): void {
    this.customerService.getAll().subscribe(
      (data: Customer[]) => {
        this.customers = data;
        this.customerMatTable = new MatTableDataSource(this.customers);
        this.customerMatTable.sort = this.sort;
        this.customerMatTable.paginator = this.paginator;
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.message, 'Hệ thống');
      }
    );
  }

  // 2
  private initUpdateCustomerForm(): void {
    this.editForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl(null, [
        Validators.minLength(4),
        Validators.required,
      ]),
      email: new FormControl(null, [
        Validators.minLength(4),
        Validators.email,
        Validators.required,
      ]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern('(0)[0-9]{9}'),
      ]),
      address: new FormControl(null, [
        Validators.minLength(4),
        Validators.required,
      ]),
      gender: new FormControl(true),
      active: new FormControl(true),
      notLocked: new FormControl(true),
    });
  }

  // 3
  private showImageThumbnail(file: File): void {
    let reader = new FileReader();
    reader.onload = (e) => {
      (document.getElementById('editCustomerThumbnail') as HTMLImageElement)[
        'src'
      ] = e.target.result as string;
    };
    reader.readAsDataURL(file);
  }

  // public functions
  // 1
  public search(event: any): void {
    const value = (event.target as HTMLInputElement).value;
    this.customerMatTable.filter = value.trim().toLowerCase();
  }

  // 2
  public reloadList(): void {
    this.ngOnInit();
  }

  // 3
  public openUpdateModal(id: number): void {
    this.customerService.getById(id).subscribe((data: Customer) => {
      this.editForm = new FormGroup({
        id: new FormControl(id),
        name: new FormControl(data.name, [
          Validators.minLength(4),
          Validators.required,
        ]),
        email: new FormControl(data.email, [
          Validators.minLength(4),
          Validators.email,
          Validators.required,
        ]),
        phone: new FormControl(data.phone, [
          Validators.required,
          Validators.pattern('(0)[0-9]{9}'),
        ]),
        address: new FormControl(data.address, [
          Validators.minLength(4),
          Validators.required,
        ]),
        gender: new FormControl(data.gender == 'MALE'),
        active: new FormControl(data.active),
        notLocked: new FormControl(data.notLocked),
      });
      this.imageUrl = data.imageUrl;
    });
  }

  // 4
  public update(): void {
    const request: UpdateCustomerRequest = this.editForm.value;
    this.customerService.update(request, this.selectFile).subscribe(
      (data: Customer) => {
        this.toastr.success(
          `Cập nhật thành công thông tin khách hàng: ${data.name}`,
          'Hệ thống'
        );
        document.getElementById('closeBtnEdit').click();

        // reset update customer form
        this.initUpdateCustomerForm();
        this.ngOnInit();
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.message, 'Hệ thống');
      }
    );
  }

  // 5
  public imageChange(event: any): void {
    this.selectFile = event.target['files'][0];
    this.showImageThumbnail(this.selectFile);
  }

  // 6
  public delete(email: string, name: String): void {
    Swal.fire({
      title: 'Bạn muốn xoá người dùng: ' + name + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Không',
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.deleteByEmail(email).subscribe(
          () => {
            this.toastr.success('Xóa thành công', 'Hệ thống');
            this.ngOnInit();
          },
          (errorResponse: HttpErrorResponse) => {
            this.toastr.error(
              `Xóa thất bại, vui lòng thử lại. Lỗi chi tiết: ${errorResponse.error.message}`,
              'Hệ thống'
            );
          }
        );
      }
    });
  }
}
