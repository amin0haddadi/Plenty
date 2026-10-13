export type Product = {
  id: string;
  name: string;
  unit: string;
  price: number;
  image: string;
  inStock: boolean;
  category: string;
  description: string;
};

export type CartLine = {
  productId: string;
  qty: number;
};

export type Address = {
  id: string;
  title: string;
  city: string;
  line: string;
  plaque: string;
  unit: string;
  phone: string;
  isDefault: boolean;
};

export type OrderStatus =
  | 'waiting_payment'
  | 'preparing'
  | 'waiting_courier'
  | 'shipping'
  | 'delivered'
  | 'cancelled';

export type OrderItem = {
  productId: string;
  name: string;
  qty: number;
  unit: string;
  price: number;
  image: string;
};

export type Order = {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingLabel: string;
  total: number;
  createdAt: string;
  addressTitle: string;
  addressLine: string;
  phone: string;
  eta: string;
  courierName?: string;
};
