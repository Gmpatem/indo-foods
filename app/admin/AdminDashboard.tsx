'use client';

import Link from 'next/link';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  UtensilsCrossed, 
  TrendingUp,
  Clock,
  Package,
  CheckCircle,
  DollarSign,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import type { Order } from '@/types';
import { useState } from 'react';

interface AdminDashboardProps {
  stats: {
    todayOrders: number;
    todayRevenue: number;
    newOrders: number;
    preparingOrders: number;
    readyOrders: number;
    completedOrders: number;
  };
  recentOrders: Order[];
}

export default function AdminDashboard({ stats, recentOrders }: AdminDashboardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile-Optimized Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 md:px-6 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                  <LayoutDashboard className="w-5 h-5 md:w-7 md:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-slate-900">Admin</h1>
                  <p className="text-xs md:text-base text-slate-600 hidden sm:block">Management Panel</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold transition"
              >
                View Site
              </Link>
              <Link
                href="/pos"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition"
              >
                Open POS
              </Link>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {showMenu && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg">
              <div className="p-4 space-y-2">
                <Link
                  href="/"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg"
                >
                  <span>View Site</span>
                </Link>
                <Link
                  href="/pos"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg"
                >
                  <span>Open POS</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile-Optimized Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200 overflow-x-auto scrollbar-hide sticky top-16 md:top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex gap-1 min-w-max">
            <Link
              href="/admin"
              className="px-4 py-3 md:px-6 bg-brand-primary text-white font-semibold rounded-t-xl whitespace-nowrap"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/orders"
              className="px-4 py-3 md:px-6 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold rounded-t-xl transition whitespace-nowrap"
            >
              Orders
            </Link>
            <Link
              href="/admin/menu"
              className="px-4 py-3 md:px-6 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold rounded-t-xl transition whitespace-nowrap"
            >
              Menu
            </Link>
            <Link
              href="/admin/settings"
              className="px-4 py-3 md:px-6 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold rounded-t-xl transition whitespace-nowrap"
            >
              Settings
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {/* Today's Orders */}
          <div className="card p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                TODAY
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
              {stats.todayOrders}
            </p>
            <p className="text-xs md:text-sm text-slate-600 font-medium">Total Orders</p>
          </div>

          {/* Today's Revenue */}
          <div className="card p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg md:rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                REVENUE
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
              ₱{stats.todayRevenue.toFixed(0)}
            </p>
            <p className="text-xs md:text-sm text-slate-600 font-medium">Today's Earnings</p>
          </div>

          {/* Pending Orders */}
          <div className="card p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-lg md:rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                NEW
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
              {stats.newOrders + stats.preparingOrders}
            </p>
            <p className="text-xs md:text-sm text-slate-600 font-medium">Pending</p>
          </div>

          {/* Completed */}
          <div className="card p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-lg md:rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                DONE
              </span>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
              {stats.completedOrders}
            </p>
            <p className="text-xs md:text-sm text-slate-600 font-medium">Completed</p>
          </div>
        </div>

        {/* Status Breakdown - Mobile Optimized */}
        <div className="card p-4 md:p-6 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6">Order Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <div className="text-center p-3 md:p-4 bg-blue-50 rounded-xl">
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xl md:text-2xl font-bold text-blue-600">{stats.newOrders}</p>
              <p className="text-xs md:text-sm text-slate-600 font-medium">New</p>
            </div>
            <div className="text-center p-3 md:p-4 bg-orange-50 rounded-xl">
              <Package className="w-6 h-6 md:w-8 md:h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-xl md:text-2xl font-bold text-orange-600">{stats.preparingOrders}</p>
              <p className="text-xs md:text-sm text-slate-600 font-medium">Preparing</p>
            </div>
            <div className="text-center p-3 md:p-4 bg-green-50 rounded-xl">
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600 mx-auto mb-2" />
              <p className="text-xl md:text-2xl font-bold text-green-600">{stats.readyOrders}</p>
              <p className="text-xs md:text-sm text-slate-600 font-medium">Ready</p>
            </div>
            <div className="text-center p-3 md:p-4 bg-slate-50 rounded-xl">
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xl md:text-2xl font-bold text-slate-600">{stats.completedOrders}</p>
              <p className="text-xs md:text-sm text-slate-600 font-medium">Completed</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 card p-4 md:p-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-slate-900">Recent Orders</h2>
              <Link
                href="/admin/orders"
                className="flex items-center gap-2 text-brand-primary hover:text-brand-secondary font-semibold transition text-sm md:text-base"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 md:w-16 md:h-16 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {recentOrders.map((order) => {
                  const orderTime = new Date(order.created_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  const statusColors = {
                    new: 'bg-blue-100 text-blue-700',
                    preparing: 'bg-orange-100 text-orange-700',
                    ready: 'bg-green-100 text-green-700',
                    completed: 'bg-slate-100 text-slate-700',
                    cancelled: 'bg-red-100 text-red-700',
                  };

                  return (
                    <div key={order.id} className="flex items-center justify-between p-3 md:p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition">
                      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-lg flex items-center justify-center font-bold text-slate-900 border-2 border-slate-200 flex-shrink-0">
                          #{order.order_number.toString().padStart(4, '0').slice(-2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm md:text-base truncate">
                            {order.customer_name || 'POS Order'}
                          </p>
                          <p className="text-xs md:text-sm text-slate-600">{orderTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                        <span className={`px-2 md:px-3 py-1 rounded-lg text-xs font-semibold ${statusColors[order.status]}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <p className="font-bold text-slate-900 text-sm md:text-base">
                          ₱{order.total.toFixed(0)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4 md:mb-6">Quick Actions</h2>
            <div className="space-y-2 md:space-y-3">
              <Link
                href="/pos"
                className="flex items-center gap-3 p-3 md:p-4 bg-brand-primary hover:bg-brand-secondary text-white rounded-xl transition group"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm md:text-base">Open POS</p>
                  <p className="text-xs text-white/80">Take orders</p>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/admin/menu"
                className="flex items-center gap-3 p-3 md:p-4 bg-slate-100 hover:bg-slate-200 rounded-xl transition group"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <UtensilsCrossed className="w-5 h-5 text-slate-700" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 text-sm md:text-base">Menu</p>
                  <p className="text-xs text-slate-600">Add/edit items</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/admin/orders"
                className="flex items-center gap-3 p-3 md:p-4 bg-slate-100 hover:bg-slate-200 rounded-xl transition group"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-slate-700" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 text-sm md:text-base">All Orders</p>
                  <p className="text-xs text-slate-600">View history</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Padding */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
