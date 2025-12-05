'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { createOrder } from '@/lib/db';
import { User, Phone, MapPin, ShoppingBag, Loader2 } from 'lucide-react';
import type { OrderItem } from '@/types';

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderType = searchParams.get('type') as 'delivery' | 'pickup' || 'pickup';
  
  const { items, getSubtotal, getTax, getTotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      router.push('/menu');
    }
  }, [items, router]);

  const deliveryFee = orderType === 'delivery' ? 2.99 : 0;
  const finalTotal = getTotal() + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const dbOrderItems: OrderItem[] = items.map((item, index) => ({
        id: `${item.menuItemId}-${index}`,
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const orderData = {
        type: 'online' as const,
        status: 'new' as const,
        items: dbOrderItems,
        subtotal: getSubtotal(),
        tax: getTax(),
        total: finalTotal,
        customer_name: formData.name,
        customer_phone: formData.phone,
        delivery_address: orderType === 'delivery' ? formData.address : undefined,
        order_type: orderType,
        is_paid: false,
      };

      const order = await createOrder(orderData);
      clearCart();
      router.push(`/order/${order.id}`);
    } catch (err) {
      console.error('Order creation failed:', err);
      setError('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input pl-10"
                        placeholder="Juan Dela Cruz"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input pl-10"
                        placeholder="+63 912 345 6789"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {orderType === 'delivery' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Delivery Address</h2>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="input pl-10 resize-none"
                      rows={3}
                      placeholder="Street address, barangay, city"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input resize-none"
                  rows={3}
                  placeholder="Any special requests or dietary restrictions?"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  `Place Order (₱${finalTotal.toFixed(2)})`
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.menuItemId} className="flex justify-between text-sm">
                    <span className="text-slate-700">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="font-semibold text-slate-900">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₱{getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (10%)</span>
                  <span>₱{getTax().toFixed(2)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Fee</span>
                    <span>₱{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-brand-primary text-2xl">
                    ₱{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 text-blue-700">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-semibold text-sm">
                    {orderType === 'delivery' ? 'Delivery' : 'Pickup'} Order
                  </span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Estimated time: 30-45 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
