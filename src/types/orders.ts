export interface OrderItem {
  id: number;
  product_name: string;
  variant_sku: string;
  quantity: number;
  selling_price: string;
  image_url?: string;
}

export interface Order {
  id: number;
  order_number: string;
  customer: number;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  total: string;
  created_at: string;
  items: OrderItem[];
}

export interface ReturnRequest {
  id: number;
  order: number;
  status: string;
  reason: string;
  created_at: string;
}
