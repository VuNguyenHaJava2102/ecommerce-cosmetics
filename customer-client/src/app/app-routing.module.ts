import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignFormComponent } from './component/sign-form/sign-form.component';
import { HomepageComponent } from './component/homepage/homepage.component';
import { AboutComponent } from './component/about/about.component';
import { FavouriteItemsComponent } from './component/favourite-items/favourite-items.component';
import { ContactComponent } from './component/contact/contact.component';
import { CartComponent } from './component/cart/cart.component';
import { AllProductComponent } from './component/all-product/all-product.component';
import { ByCategoryComponent } from './component/by-category/by-category.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { ProductDetailComponent } from './component/product-detail/product-detail.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { ProfileComponent } from './component/profile/profile.component';
import { authenticationGuard } from './guard/authentication.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'sign-form',
    component: SignFormComponent,
  },
  {
    path: 'home',
    component: HomepageComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'all-product',
    component: AllProductComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'by-category/:id',
    component: ByCategoryComponent,
  },
  {
    path: 'product-detail/:id',
    component: ProductDetailComponent,
  },
  {
    path: 'favourite-items',
    component: FavouriteItemsComponent,
    canActivate: [authenticationGuard],
  },
  {
    path: 'cart-items',
    component: CartComponent,
    canActivate: [authenticationGuard],
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authenticationGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authenticationGuard],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
