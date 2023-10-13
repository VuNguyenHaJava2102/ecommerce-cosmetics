export class User {
  id: number;
  email: string;
  name: string;
  password: string;
  address: string;
  phone: string;
  gender: string;
  imageUrl: string;
  registerDate: Date;
  active: boolean;
  notLocked: boolean;
  role: string;
  authorities: string[];
}
