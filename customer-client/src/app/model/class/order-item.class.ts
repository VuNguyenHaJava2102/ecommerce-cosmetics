import { Order } from './order.class';
import { Product } from './product.class';

export class OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: Product;
  order: Order;
}
