export class Customer {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  gender: string;
  imageUrl: string;
  registerDate: Date;
  active: boolean;
  notLocked: boolean;
  role: string;
  authorities: string[];

  constructor() {}
}
