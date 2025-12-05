'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download,
  Clock,
  Package,
  CheckCircle,
  XCircle,
  Calendar,
  RefreshCw,
  Phone,
  MapPin,
  User,
  ShoppingBag
} from 'lucide-react';
import { updateOrderStatus } from '@/lib/db';
import type { Order } from '@/types';
import { useRouter } from 'next/navigation';

interface AllOrdersClientProps {
  initialOrders: Order[];
}

export default function AllOrdersClient({ initialOrders }: AllOrdersClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pos' | 'online'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statusConfig = {
    new: { label: 'New', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-100', icon: Clock },
    preparing: { label: 'Preparing', color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-100', icon: Package },
    ready: { label: 'Ready', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-100', icon: CheckCircle },
    completed: { label: 'Completed', color: 'bg-slate-500', textColor: 'text-slate-700', bgColor: 'bg-slate-100', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-100', icon: XCircle },
  };

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.order_number.toString().includes(searchQuery) ||
        order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer_phone?.includes(searchQuery) ||
        order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(order => order.type === typeFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.created_at);
        
        if (dateFilter === 'today') {
          return orderDate >= today;
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        }
        return true;
      });
    }

    return filtered;
  }, [orders, searchQuery, statusFilter, typeFilter, dateFilter]);

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
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

  const handleExport = () => {
    const csv = [
      ['Order #', 'Date', 'Type', 'Status', 'Customer', 'Phone', 'Items', 'Total'].join(','),
      ...filteredOrders.map(order => [
        order.order_number,
        new Date(order.created_at).toLocaleString(),
        order.type,
        order.status,
        order.customer_name || 'N/A',
        order.customer_phone || 'N/A',
        order.items.length,
        order.total.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-₱{new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalRevenue = filteredOrders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin"
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <ArrowLeft className="w-6 h-6 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">All Orders</h1>
                <p className="text-slate-600">
                  {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} • ₱{totalRevenue.toFixed(2)} total
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition"
              >
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-xl transition disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ₱{isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            <Link
              href="/admin"
              className="px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold rounded-t-xl transition"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/orders"
              className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-t-xl"
            >
              All Orders
            </Link>
            <Link
              href="/admin/menu"
              className="px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold rounded-t-xl transition"
            >
              Menu Management
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="card p-6 mb-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Orders
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Order #, customer name, phone, or item..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Order Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
              >
                <option value="all">All Types</option>
                <option value="pos">POS Orders</option>
                <option value="online">Online Orders</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date Range
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'all', label: 'All Time' },
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'Last 7 Days' },
                  { value: 'month', label: 'Last 30 Days' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDateFilter(option.value as any)}
                    className={`flex-1 px-4 py-2.5 rounded-xl font-semibold transition ₱{
                      dateFilter === option.value
                        ? 'bg-brand-primary text-white'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all') && (
              <div className="lg:col-span-2 flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                    setTypeFilter('all');
                    setDateFilter('all');
                  }}
                  className="w-full px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Orders Found</h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setTypeFilter('all');
                setDateFilter('all');
              }}
              className="px-6 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-xl transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              const orderDate = new Date(order.created_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={order.id} className="card p-6 hover:shadow-lg transition">
                  {/* Order Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-slate-900">
                          #{order.order_number.toString().padStart(4, '0')}
                        </h3>
                        <div className={`flex items-center gap-2 px-3 py-1 ₱{statusConfig[order.status].color} text-white rounded-lg font-semibold text-sm`}>
                          <StatusIcon className="w-4 h-4" />
                          <span>{statusConfig[order.status].label}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-lg font-semibold text-sm ₱{
                          order.type === 'online' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {order.type === 'online' ? '🌐 Online' : '🏪 POS'}
                        </span>
                      </div>
                      <p className="text-slate-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {orderDate}
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

                  {/* Customer Info */}
                  {order.type === 'online' && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="grid md:grid-cols-2 gap-3">
                        {order.customer_name && (
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-4 h-4 text-slate-600" />
                            <span className="text-slate-700 font-medium">{order.customer_name}</span>
                          </div>
                        )}
                        {order.customer_phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-slate-600" />
                            <span className="text-slate-700">{order.customer_phone}</span>
                          </div>
                        )}
                        {order.delivery_address && (
                          <div className="flex items-start gap-2 text-sm md:col-span-2">
                            <MapPin className="w-4 h-4 text-slate-600 mt-0.5" />
                            <span className="text-slate-700">{order.delivery_address}</span>
                          </div>
                        )}
                        {order.order_type && (
                          <div className="flex items-center gap-2 text-sm">
                            <ShoppingBag className="w-4 h-4 text-slate-600" />
                            <span className="text-slate-700 capitalize">{order.order_type}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div className="bg-slate-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-slate-900 mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
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

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {order.status === 'new' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'preparing')}
                        className="flex-1 min-w-[150px] bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg transition"
                      >
                        Start Preparing
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'ready')}
                        className="flex-1 min-w-[150px] bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition"
                      >
                        Mark as Ready
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                        className="flex-1 min-w-[150px] bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition"
                      >
                        Complete Order
                      </button>
                    )}

                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                        className="px-6 bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2.5 rounded-lg transition"
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

