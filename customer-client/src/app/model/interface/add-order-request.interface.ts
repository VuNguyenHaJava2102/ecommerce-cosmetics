export interface AddOrderRequest {
  address: string;
  phone: string;
  userId: number;
  cartItemIds: number[];
}
