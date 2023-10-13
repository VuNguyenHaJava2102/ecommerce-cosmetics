export interface UpdateCustomerRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: boolean;
  active: boolean;
  notLocked: boolean;
}
