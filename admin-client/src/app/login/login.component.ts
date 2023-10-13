import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { AuthenticationService } from '../service/authentication.service';
import { User } from '../model/class/user.class';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public loading: boolean;
  public loginForm: FormGroup;
  public passwordInputType: boolean;

  // constructor, ngOn
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.checkLogin();
  }

  // public functions
  // 1
  public togglePasswordInputType(): void {
    this.passwordInputType = !this.passwordInputType;
  }

  // 2
  public loginSubmit(): void {
    this.loading = true;
    this.authenticationService.login(this.loginForm.value).subscribe(
      // - login succeed => lấy token từ server, lưu token và object: user vào localStorage
      (response: HttpResponse<User>) => {
        const token = response.headers.get('Jwt-Token');
        this.authenticationService.saveTokenToStorage(token);
        this.authenticationService.saveUserToStorage(response.body);

        Swal.fire({
          icon: 'success',
          title: 'Đăng nhập thành công!',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigateByUrl('/admin/dashboard');
        this.loading = false;
      },
      (errorResponse: HttpErrorResponse) => {
        // login fail => thông báo
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại!',
          showConfirmButton: false,
          timer: 1500,
        });
        this.toastr.error('Sai Thông Tin Đăng Nhập', 'Hệ thống');
        this.loading = false;
      }
    );
  }

  // private functions
  // 1
  checkLogin() {
    if (this.authenticationService.isUserLoggedIn()) {
      this.toastr.warning(
        'Bạn cần đăng xuất để đến trang đăng nhập!',
        'Hệ thống'
      );
      this.router.navigateByUrl('/admin');
    }
  }
}
