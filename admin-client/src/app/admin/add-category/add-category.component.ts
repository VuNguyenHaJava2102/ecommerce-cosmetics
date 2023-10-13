import { HttpErrorResponse } from '@angular/common/http';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/model/class/model.class';

import { CategoryService } from 'src/app/service/category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
})
export class AddCategoryComponent {
  public addForm: FormGroup;
  @Output() reloadList = new EventEmitter<any>();

  constructor(
    private toastr: ToastrService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initAddForm();
  }

  // public functions
  public add(): void {
    const category = this.addForm.value;
    this.categoryService.addNew(category).subscribe(
      (data: Category) => {
        console.log(data);
        this.toastr.success('Thêm thành công', 'Hệ thống');
        this.initAddForm();
        document.getElementById('closeBtnAdd').click();
        this.reloadList.emit();
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.message, 'Hệ thống');
      }
    );
  }

  // private functions
  private initAddForm(): void {
    this.addForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
      ]),
      status: new FormControl(true),
    });
  }
}
