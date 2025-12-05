'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { Trash2, CheckCircle, List, X, Menu, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createOrder } from '@/lib/db';
import { useRouter } from 'next/navigation';
import type { MenuItem, OrderItem } from '@/types';

interface POSClientProps {
  items: MenuItem[];
  categories: string[];
}

export default function POSClient({ items, categories }: POSClientProps) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const { 
    items: orderItems, 
    addItem, 
    removeItem, 
    getItemQuantity, 
    getTotalItems, 
    getSubtotal, 
    getTax, 
    getTotal, 
    clearCart 
  } = useCart();

  const filteredItems = items.filter(item => 
    activeCategory === 'All' || item.category === activeCategory
  );

  const allCategories = ['All', ...categories];

  const handleCompleteOrder = async () => {
    if (orderItems.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const dbOrderItems: OrderItem[] = orderItems.map((item, index) => ({
        id: `${item.menuItemId}-${index}`,
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const orderData = {
        type: 'pos' as const,
        status: 'new' as const,
        items: dbOrderItems,
        subtotal: getSubtotal(),
        tax: getTax(),
        total: getTotal(),
        is_paid: false,
      };

      const order = await createOrder(orderData);
      clearCart();
      setShowCart(false);
      
      alert(`Order #${order.order_number.toString().padStart(4, '0')} created successfully!`);
      
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      {/* Mobile Header */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex-shrink-0 md:px-6 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
                <span className="text-xl">🍜</span>
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-slate-900">Indo Foods POS</h1>
                <p className="text-xs text-slate-600 hidden sm:block">Staff Order System</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/pos/orders"
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-sm transition"
            >
              <List className="w-4 h-4" />
              <span className="hidden md:inline">Orders</span>
            </Link>

            <button
              onClick={() => setShowCart(true)}
              className="md:hidden relative p-2 bg-brand-primary text-white rounded-xl"
            >
              <CheckCircle className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMenu && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-slate-200 z-50 shadow-lg">
            <div className="p-4 space-y-2">
              <Link
                href="/pos/orders"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg"
              >
                <List className="w-5 h-5" />
                <span>Today's Orders</span>
              </Link>
              <Link
                href="/"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-red-600"
              >
                <X className="w-5 h-5" />
                <span>Exit POS</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* MAIN: Menu Items */}
        <div className="flex-1 overflow-y-auto p-3 md:p-6">
          {/* Category Tabs - Horizontal scroll on mobile */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 md:px-6 md:py-3 rounded-xl font-bold text-sm md:text-base whitespace-nowrap transition-all flex-shrink-0 ${
                  activeCategory === cat
                    ? 'bg-brand-primary text-white shadow-lg'
                    : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Grid - Responsive columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {filteredItems.map((item) => {
              const quantity = getItemQuantity(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => addItem(item)}
                  className="btn-pos relative text-left"
                >
                  {quantity > 0 && (
                    <div className="absolute top-2 right-2 bg-brand-primary text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shadow-lg z-10">
                      {quantity}
                    </div>
                  )}
                  
                  <span className="text-xl md:text-2xl mb-1">
                    {item.category === 'Main Dishes' && '🍛'}
                    {item.category === 'Appetizers' && '🥟'}
                    {item.category === 'Soups' && '🍜'}
                    {item.category === 'Salads' && '🥗'}
                    {item.category === 'Drinks' && '🥤'}
                    {item.category === 'Desserts' && '🍰'}
                  </span>
                  
                  <span className="font-bold text-sm md:text-base text-center line-clamp-2 mb-1">
                    {item.name}
                  </span>
                  
                  <span className="text-brand-primary font-bold text-base md:text-lg">
                    ₱{item.price.toFixed(2)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* DESKTOP: Current Order Sidebar */}
        <div className="hidden md:flex w-80 lg:w-96 bg-white border-l border-slate-200 flex-col">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Current Order</h2>
            <p className="text-sm text-slate-600 mt-1">
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {orderItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🍜</span>
                </div>
                <p className="text-slate-600 font-medium">No items yet</p>
                <p className="text-slate-500 text-sm mt-1">Tap items to add</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item.menuItemId} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-600">
                          ₱{item.price.toFixed(2)} each
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          for (let i = 0; i < item.quantity; i++) {
                            removeItem(item.menuItemId);
                          }
                        }}
                        className="text-red-500 hover:text-red-600 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => removeItem(item.menuItemId)}
                          className="w-10 h-10 bg-white border-2 border-slate-200 hover:border-slate-300 rounded-lg flex items-center justify-center font-bold text-lg"
                        >
                          −
                        </button>
                        <span className="font-bold text-xl min-w-[32px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            const menuItem = items.find(i => i.id === item.menuItemId);
                            if (menuItem) addItem(menuItem);
                          }}
                          className="w-10 h-10 bg-brand-primary hover:bg-brand-secondary text-white rounded-lg flex items-center justify-center font-bold text-lg"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold text-brand-primary text-xl">
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-6">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold">₱{getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (10%)</span>
                <span className="font-semibold">₱{getTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <span className="font-bold text-xl text-slate-900">Total</span>
                <span className="font-bold text-3xl text-brand-primary">
                  ₱{getTotal().toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCompleteOrder}
                disabled={orderItems.length === 0 || isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span>Complete Order</span>
                  </>
                )}
              </button>

              <button
                onClick={clearCart}
                disabled={orderItems.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <X className="w-5 h-5" />
                <span>Clear Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE: Cart Drawer */}
      {showCart && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowCart(false)}
          />
          <div className="md:hidden fixed inset-x-0 bottom-0 bg-white z-50 rounded-t-3xl max-h-[85vh] flex flex-col">
            {/* Handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Current Order</h2>
                  <p className="text-sm text-slate-600">
                    {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {orderItems.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-4xl mb-3 block">🍜</span>
                  <p className="text-slate-600">No items yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.menuItemId} className="bg-slate-50 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-slate-900">{item.name}</p>
                          <p className="text-sm text-slate-600">₱{item.price.toFixed(2)} each</p>
                        </div>
                        <button
                          onClick={() => {
                            for (let i = 0; i < item.quantity; i++) {
                              removeItem(item.menuItemId);
                            }
                          }}
                          className="text-red-500 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => removeItem(item.menuItemId)}
                            className="w-10 h-10 bg-white border-2 border-slate-200 rounded-lg font-bold"
                          >
                            −
                          </button>
                          <span className="font-bold text-lg min-w-[32px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              const menuItem = items.find(i => i.id === item.menuItemId);
                              if (menuItem) addItem(menuItem);
                            }}
                            className="w-10 h-10 bg-brand-primary text-white rounded-lg font-bold"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold text-brand-primary text-lg">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary & Actions */}
            <div className="border-t border-slate-200 p-6 bg-slate-50">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">₱{getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span className="font-semibold">₱{getTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-brand-primary">
                    ₱{getTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCompleteOrder}
                  disabled={orderItems.length === 0 || isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Complete Order</span>
                    </>
                  )}
                </button>

                <button
                  onClick={clearCart}
                  disabled={orderItems.length === 0}
                  className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 rounded-xl disabled:opacity-50"
                >
                  Clear Order
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
