import { Category } from './model.class';

export class Product {
  id: number;
  productCode: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  imageUrl: string;
  description: string;
  enteredDate: Date;
  active: boolean;
  sold: number;
  category: Category;
}
