import { supabase } from './supabase';
import type { MenuItem, Order } from '@/types';

export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
  return data || [];
}

export async function getAllCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('category')
    .eq('is_available', true);

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  const categories = [...new Set(data.map(item => item.category))];
  return categories.sort();
}

export async function createOrder(orderData: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    throw error;
  }
  return data;
}

export async function getOrders(type?: 'pos' | 'online'): Promise<Order[]> {
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
  return data || [];
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error fetching order:', error);
    throw error;
  }
  return data;
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function getTodayOrders(): Promise<Order[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', today.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching today orders:', error);
    throw error;
  }
  return data || [];
}

export async function getTodayRevenue(): Promise<number> {
  const orders = await getTodayOrders();
  return orders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);
}

// ==================== MENU MANAGEMENT ====================

export async function getAllMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching all menu items:', error);
    throw error;
  }
  return data || [];
}

export async function createMenuItem(itemData: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem> {
  const { data, error } = await supabase
    .from('menu_items')
    .insert([itemData])
    .select()
    .single();

  if (error) {
    console.error('Error creating menu item:', error);
    throw error;
  }
  return data;
}

export async function updateMenuItem(itemId: string, itemData: Partial<MenuItem>): Promise<MenuItem> {
  const { data, error } = await supabase
    .from('menu_items')
    .update({ ...itemData, updated_at: new Date().toISOString() })
    .eq('id', itemId)
    .select()
    .single();

  if (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
  return data;
}

export async function deleteMenuItem(itemId: string): Promise<void> {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
}

export async function toggleMenuItemAvailability(itemId: string, isAvailable: boolean): Promise<void> {
  const { error } = await supabase
    .from('menu_items')
    .update({ 
      is_available: isAvailable,
      updated_at: new Date().toISOString() 
    })
    .eq('id', itemId);

  if (error) {
    console.error('Error toggling menu item availability:', error);
    throw error;
  }
}
