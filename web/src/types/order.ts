export interface Order {
  id: string;
  user_id: string;
  total: number;
  items: Array<Item>;
  created_at: Date;
  updated_at: Date;
  customer_name: string;
  customer_email: string;
}

export interface Item {
  id: string;
  order_id: string;
  product_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: Date;
  updated_at: Date;
  product: Product;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: Date;
  updated_at: Date;
}

