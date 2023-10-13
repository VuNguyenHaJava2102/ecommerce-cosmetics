import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../service/authentication.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    httpHandler: HttpHandler
  ): Observable<HttpEvent<any>> {
    // bỏ qua các request này. Vì các request này không cần token
    const login = `http://localhost:8080/user/login`;
    const register = `http://localhost:8080/user/register`;

    const addCartItem = 'http://localhost:8080/cart-item/add';

    const getAllCategory = `http://localhost:8080/category/get-all`;
    const getAllCategoryById = `http://localhost:8080/category/get-by-id`;

    const faItemCountByUser =
      'http://localhost:8080/favourite-item/count-by-user';
    const faItemCountByProduct =
      'http://localhost:8080/favourite-item/count-by-product';

    const getActiveProducts = 'http://localhost:8080/product/all-active';
    const getBestSellerProducts = 'http://localhost:8080/product/best-seller';
    const getNewestProducts = 'http://localhost:8080/product/newest';
    const getRatingProducts = 'http://localhost:8080/product/best-rating';
    const getProductById = 'http://localhost:8080/product/get-by-id';
    const getProductByCategory =
      'http://localhost:8080/product/get-by-category';

    const getAllRatings = 'http://localhost:8080/rating/get-all';
    const getRatingsByProduct = 'http://localhost:8080/rating/get-by-product';
    const getRelatedProducts = 'http://localhost:8080/rating/get-related';

    const allowedUrls = [
      login,
      register,
      addCartItem,
      getAllCategory,
      getAllCategoryById,
      faItemCountByUser,
      faItemCountByProduct,
      getActiveProducts,
      getBestSellerProducts,
      getNewestProducts,
      getRatingProducts,
      getProductById,
      getProductByCategory,
      getAllRatings,
      getRatingsByProduct,
      getRelatedProducts,
    ];

    if (allowedUrls.some((ele: string) => request.url.includes(ele))) {
      return httpHandler.handle(request);
    }

    // set token cho các request còn lại
    this.authenticationService.loadTokenFromStorage();
    const token = this.authenticationService.getTokenFromStorage();
    const cloneRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return httpHandler.handle(cloneRequest);
  }
}
