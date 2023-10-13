import { Component, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from 'src/app/service/authentication.service';
import { Notification } from 'src/app/model/class/notification.class';
import { NotificationService } from 'src/app/service/notification.service';
import { CustomerService } from 'src/app/service/customer.service';
import { ChatMessage } from 'src/app/model/class/chat-message.class';
import { UpdateCustomerRequest } from 'src/app/model/interface/update-customer-request.interface';
import { Customer } from 'src/app/model/class/customer.class';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private selectFile: File;

  public imageUrl: string;
  public username: string;
  public totalUnreadNotifications: number;
  public notifications: Notification[] = [];
  public form: FormGroup;

  // constructor, ngOn
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.getLoggedUser();
    this.getAllNotifications();
    this.initProfileForm();
  }

  // public functions
  // 1
  public logout(): void {
    this.authenticationService.logout();
    this.router.navigateByUrl('/login');
    this.toastr.success('Bạn vừa đăng xuất', 'Hệ thống');
  }

  // 2
  public setOneRead(id: number): void {
    this.notificationService.setOneRead(id).subscribe((data: Notification) => {
      this.getAllNotifications();
    });
  }

  // 3
  public setAllRead(): void {
    this.notificationService.setAllRead().subscribe(
      () => {
        this.getAllNotifications();
        this.toastr.success('Thành công', 'Hệ thống');
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(
          `Thất bại. Chi tiết lỗi: ${errorResponse.error.message}`,
          'Hệ thống'
        );
      }
    );
  }

  // 4
  public imageChange(event: any): void {
    this.selectFile = event.target['files'][0];
    this.showImageThumbnail(this.selectFile);
  }

  // 5
  public update(): void {
    const request: UpdateCustomerRequest = this.form.value;
    this.customerService.update(request, this.selectFile).subscribe(
      (data: Customer) => {
        this.toastr.success('Chỉnh sửa thành công', 'Hệ thống');
        document.getElementById('closeBtn').click();
        this.authenticationService.saveUserToStorage(data);
        this.ngOnInit();
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(
          `Thất bại. Chi tiết lỗi: ${errorResponse.error.message}`,
          'Hệ thống'
        );
      }
    );
  }

  // private functions
  // 1
  private getLoggedUser(): void {
    let loggedUser = this.authenticationService.getUserFromStorage();
    if (loggedUser == null) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.imageUrl = loggedUser.imageUrl;
    this.username = loggedUser.name;
  }

  // 2
  private getAllNotifications(): void {
    this.notificationService
      .getAllOrderByIdDesc()
      .subscribe((data: Notification[]) => {
        this.notifications = data;

        let count = 0;
        for (const item of this.notifications) {
          if (!item.read) {
            count++;
          }
        }
        this.totalUnreadNotifications = count;
      });
  }

  // 3
  private showImageThumbnail(file: File): void {
    let reader = new FileReader();
    reader.onload = (e) => {
      (document.getElementById('adminThumbnail') as HTMLImageElement)['src'] = e
        .target.result as string;
    };
    reader.readAsDataURL(file);
  }

  // 4
  private initProfileForm(): void {
    let user = this.authenticationService.getUserFromStorage();

    this.imageUrl = user.imageUrl;
    this.form = new FormGroup({
      id: new FormControl(user.id),
      name: new FormControl(user.name, [
        Validators.minLength(4),
        Validators.required,
      ]),
      email: new FormControl(user.email, [
        Validators.minLength(4),
        Validators.email,
        Validators.required,
      ]),
      phone: new FormControl(user.phone, [
        Validators.minLength(4),
        Validators.required,
        Validators.pattern('(0)[0-9]{9}'),
      ]),
      address: new FormControl(user.address, [
        Validators.minLength(4),
        Validators.required,
      ]),
      gender: new FormControl(user.gender === 'MALE'),
      active: new FormControl(user.active),
      notLocked: new FormControl(user.notLocked),
    });
  }
}
