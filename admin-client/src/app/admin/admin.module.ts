import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AdminComponent } from './admin.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomerComponent } from './customer/customer.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { CategoryComponent } from './category/category.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { ProductComponent } from './product/product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { RatingComponent } from './rating/rating.component';
import { InventoryComponent } from './inventory/inventory.component';
import { OrderComponent } from './order/order.component';
import { BestSellerComponent } from './best-seller/best-seller.component';
import { authenticationGuard } from '../authentication.guard';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authenticationGuard],
      },
      {
        path: 'customer',
        component: CustomerComponent,
        canActivate: [authenticationGuard],
      },
      {
        path: 'category',
        component: CategoryComponent,
        canActivate: [authenticationGuard],
      },
      {
        path: 'product',
        component: ProductComponent,
        canActivate: [authenticationGuard],
      },
      {
        path: 'rating',
        component: RatingComponent,
        canActivate: [authenticationGuard],
      },
      {
        path: 'order',
        component: OrderComponent,
        canActivate: [authenticationGuard],
      },
      {
        path: 'inventory',
        component: InventoryComponent,
        canActivate: [authenticationGuard],
      },
      {
        path: 'best-seller',
        component: BestSellerComponent,
        canActivate: [authenticationGuard],
      },
    ],
  },
];

@NgModule({
  declarations: [
    AdminComponent,
    SidebarComponent,
    DashboardComponent,
    CustomerComponent,
    FooterComponent,
    HeaderComponent,
    AddCustomerComponent,
    CategoryComponent,
    AddCategoryComponent,
    ProductComponent,
    AddProductComponent,
    RatingComponent,
    InventoryComponent,
    OrderComponent,
    BestSellerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 2500,
      progressAnimation: 'increasing',
      closeButton: true,
    }),
    MatFormFieldModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatTabsModule,
    NgbModule,
  ],
})
export class AdminModule {}
