import { Product } from './product.class';
import { User } from './user.class';

export class CartItem {
  id: number;
  quantity: number;
  price: number;
  product: Product;
  user: User;

  constructor(
    id: number,
    quantity: number,
    price: number,
    product: Product,
    user: User
  ) {
    this.id = id;
    this.quantity = quantity;
    this.price = price;
    this.product = product;
    this.user = user;
  }
}
