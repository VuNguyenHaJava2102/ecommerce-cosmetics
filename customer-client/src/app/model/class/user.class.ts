export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  gender: string;
  imageUrl: string;
  registerDate: Date;
  isActive: boolean;
  isNotLocked: boolean;
  role: string;
  authorities: string[];
}
