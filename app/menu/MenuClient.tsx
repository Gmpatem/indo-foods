'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { Search, X, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { MenuItem } from '@/types';

interface MenuClientProps {
  items: MenuItem[];
  categories: string[];
}

function MenuContent({ items, categories }: MenuClientProps) {
  const searchParams = useSearchParams();
  const orderType = searchParams.get('type') as 'delivery' | 'pickup' || 'pickup';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  const { 
    items: cartItems, 
    addItem, 
    removeItem, 
    getItemQuantity, 
    getTotalItems, 
    getSubtotal, 
    getTax, 
    getTotal,
    clearCart 
  } = useCart();

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const allCategories = ['All', ...categories];
  const deliveryFee = orderType === 'delivery' ? 2.99 : 0;
  const finalTotal = getTotal() + deliveryFee;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT: Menu Section */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Our Menu</h1>
              <p className="text-slate-600">
                Order for {orderType === 'delivery' ? 'Delivery 🚴' : 'Pickup 🛍️'}
              </p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition ${
                    activeCategory === category
                      ? 'bg-brand-primary text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const quantity = getItemQuantity(item.id);
                return (
                  <div key={item.id} className="card overflow-hidden">
                    {item.image && (
                      <div className="relative h-48 bg-slate-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-slate-900 mb-2">{item.name}</h3>
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{item.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-brand-primary">
                          ₱{item.price.toFixed(2)}
                        </span>
                        
                        {quantity === 0 ? (
                          <button
                            onClick={() => addItem(item)}
                            className="btn-primary px-4 py-2 text-sm"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold"
                            >
                              −
                            </button>
                            <span className="font-bold text-lg min-w-[24px] text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => addItem(item)}
                              className="w-8 h-8 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg font-bold"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600">No items found</p>
              </div>
            )}
          </div>

          {/* RIGHT: Order Summary - Desktop */}
          <div className="hidden lg:block w-96">
            <div className="card p-6 sticky top-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-slate-900">Your Order</h2>
                  <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg font-semibold text-sm">
                    {orderType === 'delivery' ? '🚴 Delivery' : '🛍️ Pickup'}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                </p>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.menuItemId} className="flex justify-between items-start p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-sm text-slate-600">₱{item.price.toFixed(2)} × {item.quantity}</p>
                        </div>
                        <button
                          onClick={() => {
                            for (let i = 0; i < item.quantity; i++) {
                              removeItem(item.menuItemId);
                            }
                          }}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mb-6">
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

                  <div className="space-y-3">
                    <Link
                      href={`/checkout?type=${orderType}`}
                      className="block w-full btn-primary text-center"
                    >
                      Proceed to Checkout
                    </Link>
                    <button
                      onClick={clearCart}
                      className="w-full btn-secondary"
                    >
                      Clear All Items
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Floating Checkout Button */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-slate-600">{getTotalItems()} items</p>
              <p className="text-xl font-bold text-brand-primary">₱{finalTotal.toFixed(2)}</p>
            </div>
            <Link
              href={`/checkout?type=${orderType}`}
              className="btn-primary px-6 py-3"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MenuClient(props: MenuClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading menu...</p>
        </div>
      </div>
    }>
      <MenuContent {...props} />
    </Suspense>
  );
}
