import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
// import { OrderModule } from 'ngx-order-pipe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { SignFormComponent } from './component/sign-form/sign-form.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { HomepageComponent } from './component/homepage/homepage.component';
import { AuthenticationInterceptor } from './interceptor/authentication.interceptor';
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
import { SearchComponent } from './component/search/search.component';
import { RatingComponent } from './component/rating/rating.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SignFormComponent,
    ForgotPasswordComponent,
    HomepageComponent,
    AboutComponent,
    FavouriteItemsComponent,
    ContactComponent,
    CartComponent,
    AllProductComponent,
    ByCategoryComponent,
    NotFoundComponent,
    ProductDetailComponent,
    CheckoutComponent,
    ProfileComponent,
    SearchComponent,
    RatingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      progressAnimation: 'increasing',
      closeButton: true,
    }),
    SlickCarouselModule,
    NgbModule,
    NgxPaginationModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
