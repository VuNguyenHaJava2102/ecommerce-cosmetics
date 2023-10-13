import { User } from './user.class';

export class Order {
  id: number;
  orderCode: string;
  orderTime: Date;
  realAmount: number;
  checkoutAmount: number;
  address: string;
  phone: string;
  orderStatus: string;
  user: User;
}
