import { Product } from './product.class';
import { User } from './user.class';

export class Rating {
  id: number;
  ratingPoint: number;
  comment: string;
  ratingTime: Date;
  user: User;
  product: Product;
}
