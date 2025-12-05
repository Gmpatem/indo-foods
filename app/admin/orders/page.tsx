import { getOrders } from '@/lib/db';
import AllOrdersClient from './AllOrdersClient';

export const dynamic = 'force-dynamic';

export default async function AllOrdersPage() {
  const orders = await getOrders();

  return <AllOrdersClient initialOrders={orders} />;
}
