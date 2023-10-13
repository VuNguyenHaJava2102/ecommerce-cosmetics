import { Category } from './category.class';

export class Product {
  id: number;
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

  constructor(id: number) {
    this.id = id;
  }
}
