export interface Orders {
  id: string;
  user_id: string;
  total: number;
  items: Array<Item>;
  created_at: Date;
  updated_at: Date;
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
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: Date;
  updated_at: Date;
}