export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderType = 'pos' | 'online';
export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type OnlineOrderType = 'pickup' | 'delivery';

export interface Order {
  id: string;
  order_number: number;
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  customer_name?: string;
  customer_phone?: string;
  delivery_address?: string;
  order_type?: OnlineOrderType;
  is_paid: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CartItem extends Omit<OrderItem, 'id'> {}

export interface CartState {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTax: () => number;
  getGrandTotal: () => number;
}
