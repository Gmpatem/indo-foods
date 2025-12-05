import { getTodayOrders } from '@/lib/db';
import OrdersClient from './OrdersClient';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const orders = await getTodayOrders();

  return <OrdersClient initialOrders={orders} />;
}
