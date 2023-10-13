import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from 'src/app/service/authentication.service';
import { User } from 'src/app/model/class/user.class';
import { RegisterRequest } from 'src/app/model/interface/register-request.interface';

@Component({
  selector: 'app-sign-form',
  templateUrl: './sign-form.component.html',
  styleUrls: ['./sign-form.component.css'],
})
export class SignFormComponent {
  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public showLogin: boolean;
  public showSignup: boolean;

  // constructor, ngOn
  constructor(
    private toastr: ToastrService,
    private authenticationService: AuthenticationService
  ) {
    // initialize login form
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });

    // initialize register form
    this.registerForm = new FormGroup({
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

  // public functions
  // 1
  public onLoginSubmit(): void {
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
        setTimeout(() => {
          window.location.href = '/home';
        }, 500);
      },
      (errorResponse: HttpErrorResponse) => {
        // login fail => thông báo
        Swal.fire({
          icon: 'error',
          title: 'Đăng nhập thất bại!',
          showConfirmButton: false,
          timer: 1500,
        });
        this.toastr.error(
          `Lỗi hệ thống: ${errorResponse.error.message}`,
          'Hệ thống'
        );
      }
    );
  }

  // 2
  public onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      this.toastr.error('Hãy nhập đầy đủ thông tin!', 'Hệ thống');
      return;
    }

    const register: RegisterRequest = this.registerForm.value;
    console.log(register);

    this.authenticationService.register(register).subscribe(
      (data: User) => {
        Swal.fire({
          icon: 'success',
          title: `Đăng kí người dùng ${data.name} thành công! Hãy đăng nhập để sử dụng dịch vụ của chúng tôi`,
          showConfirmButton: false,
          timer: 3000,
        });
        setTimeout(() => {
          window.location.href = '/sign-form';
        }, 3000);
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(
          `Lỗi hệ thống: ${errorResponse.error.message}`,
          'Hệ thống'
        );
      }
    );
  }

  //
  public displayHidePasswordLogin(): void {
    this.showLogin = !this.showLogin;
  }

  //
  public displayHidePasswordSignup(): void {
    this.showSignup = !this.showSignup;
  }
}
