import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    if (!this.authenticationService.isUserLoggedIn()) {
      this.router.navigate(['/login']);
      this.toastr.warning(
        'Bạn cần đăng nhập để truy cập vào ứng dụng',
        'Hệ thống'
      );
    }
  }
}
