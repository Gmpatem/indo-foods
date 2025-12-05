import { getOrders, getTodayOrders, getTodayRevenue } from '@/lib/db';
import AdminDashboard from './AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const todayOrders = await getTodayOrders();
  const todayRevenue = await getTodayRevenue();
  const recentOrders = await getOrders();

  const stats = {
    todayOrders: todayOrders.length,
    todayRevenue,
    newOrders: todayOrders.filter(o => o.status === 'new').length,
    preparingOrders: todayOrders.filter(o => o.status === 'preparing').length,
    readyOrders: todayOrders.filter(o => o.status === 'ready').length,
    completedOrders: todayOrders.filter(o => o.status === 'completed').length,
  };

  return <AdminDashboard stats={stats} recentOrders={recentOrders.slice(0, 10)} />;
}
