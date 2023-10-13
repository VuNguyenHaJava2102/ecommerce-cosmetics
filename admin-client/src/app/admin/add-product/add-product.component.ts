import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';

import { CategoryService } from 'src/app/service/category.service';
import { PageService } from 'src/app/service/page.service';
import { Category } from 'src/app/model/class/model.class';
import { ProductService } from 'src/app/service/product.service';
import { Product } from 'src/app/model/class/product.class';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {
  private selectFile: File;

  public categories: Category[];
  public addForm: FormGroup;
  @Output() reloadList = new EventEmitter<any>();

  // constructor, ngOn
  constructor(
    private toastr: ToastrService,
    private pageService: PageService,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.pageService.setActivePage('product');
    this.getAllCategories();
    this.initAddProductForm();
  }

  // public functions
  // 1
  public imageChange(event: any): void {
    this.selectFile = event.target['files'][0];
    this.showImageThumbnail(this.selectFile);
  }

  // 2
  public save(): void {
    const product = this.addForm.value;
    this.productService.addNew(product, this.selectFile).subscribe(
      (data: Product) => {
        this.toastr.success(
          `Thêm thành công sản phẩm: ${data.name}`,
          'Hệ thống'
        );
        this.reloadList.emit();
        this.initAddProductForm();
        document.getElementById('closeBtnAdd').click();
        (document.getElementById('thumbnail') as HTMLImageElement)['src'] =
          '/assets/image/default-image.jpg';
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.message, 'Hệ thống');
      }
    );
  }

  // private functions
  // 1
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

  // 2
  private showImageThumbnail(file: File): void {
    let reader = new FileReader();
    reader.onload = (e) => {
      (document.getElementById('thumbnail') as HTMLImageElement)['src'] = e
        .target.result as string;
    };
    reader.readAsDataURL(file);
  }

  // 3
  private initAddProductForm(): void {
    this.addForm = new FormGroup({
      id: new FormControl(0),
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
  }
}
