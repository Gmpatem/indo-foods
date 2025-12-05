import { getOrderById } from '@/lib/db';
import { CheckCircle, Clock, MapPin, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function OrderConfirmationPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const statusConfig = {
    new: { label: 'Order Received', color: 'bg-blue-500', icon: Clock },
    preparing: { label: 'Preparing', color: 'bg-orange-500', icon: Clock },
    ready: { label: 'Ready', color: 'bg-green-500', icon: CheckCircle },
    completed: { label: 'Completed', color: 'bg-slate-500', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-500', icon: CheckCircle },
  };

  const StatusIcon = statusConfig[order.status].icon;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
          <p className="text-slate-600">Thank you for your order</p>
        </div>

        {/* Order Number */}
        <div className="card p-6 mb-6 text-center">
          <p className="text-sm text-slate-600 mb-1">Order Number</p>
          <p className="text-3xl font-bold text-brand-primary">#{order.order_number.toString().padStart(4, '0')}</p>
        </div>

        {/* Status */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 font-medium">Status</span>
            <div className={`flex items-center gap-2 px-4 py-2 ${statusConfig[order.status].color} text-white rounded-xl font-semibold`}>
              <StatusIcon className="w-5 h-5" />
              <span>{statusConfig[order.status].label}</span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="card p-6 mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Order Details</h2>

          {/* Customer Info */}
          <div className="space-y-3 mb-6 pb-6 border-b border-slate-200">
            {order.customer_name && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" />
                <span className="text-slate-700">{order.customer_name}</span>
              </div>
            )}
            {order.customer_phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-slate-400" />
                <span className="text-slate-700">{order.customer_phone}</span>
              </div>
            )}
            {order.delivery_address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <span className="text-slate-700">{order.delivery_address}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center">
                {order.order_type === 'delivery' ? '🚴' : '🛍️'}
              </div>
              <span className="text-slate-700 capitalize">{order.order_type}</span>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-slate-900">Items</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-slate-700">
                  {item.quantity}× {item.name}
                </span>
                <span className="font-semibold text-slate-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-brand-primary text-2xl">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Estimated Time */}
        <div className="card p-6 mb-6 bg-brand-primary text-white">
          <div className="flex items-center gap-4">
            <Clock className="w-12 h-12" />
            <div>
              <p className="font-semibold mb-1">
                {order.order_type === 'delivery' ? 'Estimated Delivery' : 'Ready for Pickup'}
              </p>
              <p className="text-2xl font-bold">30-45 minutes</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/menu"
            className="block w-full btn-primary text-center"
          >
            Order Again
          </Link>
          <Link
            href="/"
            className="block w-full btn-secondary text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}