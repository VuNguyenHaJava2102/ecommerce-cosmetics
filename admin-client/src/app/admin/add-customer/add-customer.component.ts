import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { Customer } from 'src/app/model/class/customer.class';
import { AddCustomerRequest } from 'src/app/model/interface/add-customer-request.interface';
import { CustomerService } from 'src/app/service/customer.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css'],
})
export class AddCustomerComponent {
  private selectFile: File;
  public addForm: FormGroup;
  @Output() reloadList = new EventEmitter<any>();

  // constructor
  constructor(
    private toastr: ToastrService,
    private customerService: CustomerService
  ) {
    this.initAddCustomerForm();
  }

  // public functions
  // 1
  public add(): void {
    const request: AddCustomerRequest = this.addForm.value;
    this.customerService.add(request, this.selectFile).subscribe(
      (data: Customer) => {
        const customerName = data.name;
        this.toastr.success(
          `Thêm thành công khách hàng: ${customerName}`,
          'Hệ thống'
        );
        document.getElementById('closeBtn').click();

        // reset add customer form
        this.initAddCustomerForm();
        this.reloadList.emit();
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.message, 'Hệ thống');
      }
    );
  }

  // 2
  public imageChange(event: any): void {
    this.selectFile = event.target['files'][0];
    this.showImageThumbnail(this.selectFile);
  }

  // private functions
  // 1
  private showImageThumbnail(file: File): void {
    let reader = new FileReader();
    reader.onload = (e) => {
      (document.getElementById('addCustomerThumbnail') as HTMLImageElement)[
        'src'
      ] = e.target.result as string;
    };
    reader.readAsDataURL(file);
  }

  // 2
  private initAddCustomerForm(): void {
    this.addForm = new FormGroup({
      name: new FormControl(null, [
        Validators.minLength(4),
        Validators.required,
      ]),
      email: new FormControl(null, [
        Validators.minLength(4),
        Validators.email,
        Validators.required,
      ]),
      password: new FormControl(null, [
        Validators.minLength(6),
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
    });
  }
}
