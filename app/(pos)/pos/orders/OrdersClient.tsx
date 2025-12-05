'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, CheckCircle, XCircle, Package, Filter, RefreshCw } from 'lucide-react';
import { updateOrderStatus } from '@/lib/db';
import type { Order } from '@/types';
import { useRouter } from 'next/navigation';

interface OrdersClientProps {
  initialOrders: Order[];
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const statusConfig = {
    new: { label: 'New', color: 'bg-blue-500', icon: Clock },
    preparing: { label: 'Preparing', color: 'bg-orange-500', icon: Package },
    ready: { label: 'Ready', color: 'bg-green-500', icon: CheckCircle },
    completed: { label: 'Completed', color: 'bg-slate-500', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-500', icon: XCircle },
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update order status');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getOrdersByStatus = (status: Order['status']) => 
    orders.filter(order => order.status === status).length;

  const todayRevenue = orders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/pos"
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Today's Orders</h1>
                <p className="text-sm text-slate-600">
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'} • ₱{todayRevenue.toFixed(2)} revenue
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-xl transition disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ₱{isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-5 gap-3">
            <button
              onClick={() => setStatusFilter('all')}
              className={`p-3 rounded-xl text-center transition ₱{
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-xs font-semibold">All Orders</p>
            </button>

            <button
              onClick={() => setStatusFilter('new')}
              className={`p-3 rounded-xl text-center transition ₱{
                statusFilter === 'new'
                  ? 'bg-blue-500 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <p className="text-2xl font-bold">{getOrdersByStatus('new')}</p>
              <p className="text-xs font-semibold">New</p>
            </button>

            <button
              onClick={() => setStatusFilter('preparing')}
              className={`p-3 rounded-xl text-center transition ₱{
                statusFilter === 'preparing'
                  ? 'bg-orange-500 text-white'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
              }`}
            >
              <p className="text-2xl font-bold">{getOrdersByStatus('preparing')}</p>
              <p className="text-xs font-semibold">Preparing</p>
            </button>

            <button
              onClick={() => setStatusFilter('ready')}
              className={`p-3 rounded-xl text-center transition ₱{
                statusFilter === 'ready'
                  ? 'bg-green-500 text-white'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              <p className="text-2xl font-bold">{getOrdersByStatus('ready')}</p>
              <p className="text-xs font-semibold">Ready</p>
            </button>

            <button
              onClick={() => setStatusFilter('completed')}
              className={`p-3 rounded-xl text-center transition ₱{
                statusFilter === 'completed'
                  ? 'bg-slate-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <p className="text-2xl font-bold">{getOrdersByStatus('completed')}</p>
              <p className="text-xs font-semibold">Completed</p>
            </button>
          </div>
        </div>
      </header>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {filteredOrders.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Orders Found</h3>
            <p className="text-slate-600">
              {statusFilter === 'all' 
                ? 'No orders have been placed today yet.'
                : `No ₱{statusConfig[statusFilter as Order['status']].label.toLowerCase()} orders.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              const orderTime = new Date(order.created_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={order.id} className="card p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-slate-900">
                          #{order.order_number.toString().padStart(4, '0')}
                        </h3>
                        <div className={`flex items-center gap-2 px-3 py-1 ₱{statusConfig[order.status].color} text-white rounded-lg font-semibold text-sm`}>
                          <StatusIcon className="w-4 h-4" />
                          <span>{statusConfig[order.status].label}</span>
                        </div>
                        {order.type === 'online' && (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold text-sm">
                            Online
                          </span>
                        )}
                        {order.type === 'pos' && (
                          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg font-semibold text-sm">
                            POS
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {orderTime}
                        {order.customer_name && ` • ₱{order.customer_name}`}
                        {order.order_type && (
                          <span className="ml-2">
                            • {order.order_type === 'delivery' ? '🚴 Delivery' : '🛍️ Pickup'}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-bold text-brand-primary">
                        ₱{order.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-slate-600">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="bg-slate-50 rounded-lg p-4 mb-4">
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="text-slate-700">
                            {item.quantity}× {item.name}
                          </span>
                          <span className="font-semibold text-slate-900">
                            ₱{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Info (Online Orders) */}
                  {order.type === 'online' && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4 space-y-1 text-sm">
                      {order.customer_phone && (
                        <p className="text-slate-700">📞 {order.customer_phone}</p>
                      )}
                      {order.delivery_address && (
                        <p className="text-slate-700">📍 {order.delivery_address}</p>
                      )}
                    </div>
                  )}

                  {/* Status Actions */}
                  <div className="flex gap-2">
                    {order.status === 'new' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'preparing')}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition"
                      >
                        Start Preparing
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'ready')}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition"
                      >
                        Mark as Ready
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                        className="flex-1 bg-slate-700 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition"
                      >
                        Complete Order
                      </button>
                    )}

                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                        className="px-6 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-3 rounded-xl transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


