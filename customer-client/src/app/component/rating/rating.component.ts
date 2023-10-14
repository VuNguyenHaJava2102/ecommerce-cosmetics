import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OrderItem } from 'src/app/model/class/order-item.class';

import { Rating } from 'src/app/model/class/rating.class';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { RateService } from 'src/app/service/rate.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
})
export class RatingComponent {
  public postForm: FormGroup;
  public rate: Rating;
  public star: number = 5;
  public modalReference: any;
  @Input() orderDetail: OrderItem;
  @Output()
  editFinish: EventEmitter<any> = new EventEmitter<any>();

  // constructor, ngOn
  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private rateService: RateService
  ) {
    this.postForm = new FormGroup({
      id: new FormControl(0),
      rating: new FormControl(5),
      comment: new FormControl(null),
      rateDate: new FormControl(new Date()),
      user: new FormControl(null),
      product: new FormControl(null),
      orderDetail: new FormControl(null),
    });
  }

  ngOnInit(): void {}

  public rating(): void {
    let loggedUser = this.authenticationService.getUserFromStorage();
    // this.customerService.getByEmail(email).subscribe(
    //   (data) => {
    //     if (this.postForm.value.id == 0) {
    //       this.rate = this.postForm.value;
    //       this.rate.rating = this.star;
    //       this.rate.orderDetail = this.orderDetail;
    //       this.rate.product = this.orderDetail.product;
    //       this.rate.user = data as Customer;

    //       this.rateService.post(this.rate).subscribe(
    //         (date) => {
    //           this.toastr.success('Đánh giá thành công!', 'Hệ thống');
    //           // this.modalService.dismissAll();
    //           this.modalReference.close();
    //         },
    //         (error) => {
    //           this.toastr.error('Lỗi hệ thống!', 'Hệ thống');
    //         }
    //       );
    //     } else {
    //       this.rate = this.postForm.value;
    //       this.rate.rating = this.star;
    //       this.rateService.put(this.rate).subscribe(
    //         (date) => {
    //           this.toastr.success('Đánh giá thành công!', 'Hệ thống');
    //           // this.modalService.dismissAll();
    //           this.modalReference.close();
    //         },
    //         (error) => {
    //           this.toastr.error('Lỗi hệ thống!', 'Hệ thống');
    //         }
    //       );
    //     }
    //   },
    //   (error) => {
    //     this.toastr.error('Lỗi hệ thống!', 'Hệ thống');
    //   }
    // );
  }

  public open(content: TemplateRef<any>): void {
    this.modalReference = this.modalService.open(content, { centered: true });
  }
}
