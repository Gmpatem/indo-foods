'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Power,
  Search,
  X,
  Save,
  RefreshCw
} from 'lucide-react';
import Image from 'next/image';
import { 
  createMenuItem, 
  updateMenuItem, 
  deleteMenuItem, 
  toggleMenuItemAvailability 
} from '@/lib/db';
import type { MenuItem } from '@/types';
import { uploadMenuImage } from '@/lib/storage';
import { useRouter } from 'next/navigation';

interface MenuManagementClientProps {
  initialItems: MenuItem[];
}

export default function MenuManagementClient({ initialItems }: MenuManagementClientProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Dishes',
    image: '',
    is_available: true,
  });

  const categories = ['All', ...Array.from(new Set(items.map(item => item.category)))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        image: item.image || '',
        is_available: item.is_available,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Main Dishes',
        image: '',
        is_available: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Main Dishes',
      image: '',
      is_available: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const itemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image || undefined,
        is_available: formData.is_available,
      };

      if (editingItem) {
        // Update existing item
        const updated = await updateMenuItem(editingItem.id, itemData);
        setItems(items.map(item => item.id === editingItem.id ? updated : item));
      } else {
        // Create new item
        const created = await createMenuItem(itemData);
        setItems([...items, created]);
      }

      handleCloseModal();
      router.refresh();
    } catch (error) {
      console.error('Failed to save item:', error);
      alert('Failed to save menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAvailability = async (itemId: string, currentStatus: boolean) => {
    try {
      await toggleMenuItemAvailability(itemId, !currentStatus);
      setItems(items.map(item => 
        item.id === itemId ? { ...item, is_available: !currentStatus } : item
      ));
    } catch (error) {
      console.error('Failed to toggle availability:', error);
      alert('Failed to update item availability');
    }
  };

  const handleDelete = async (itemId: string, itemName: string) => {
    if (!confirm(`Are you sure you want to delete "₱{itemName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteMenuItem(itemId);
      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete menu item');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

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
                <h1 className="text-3xl font-bold text-slate-900">Menu Management</h1>
                <p className="text-slate-600">
                  {items.length} items • {items.filter(i => i.is_available).length} available
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ₱{isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-6 py-2 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-xl transition"
              >
                <Plus className="w-5 h-5" />
                <span>Add Item</span>
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
              className="px-6 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold rounded-t-xl transition"
            >
              All Orders
            </Link>
            <Link
              href="/admin/menu"
              className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-t-xl"
            >
              Menu Management
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="card p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Menu
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition ₱{
                      categoryFilter === cat
                        ? 'bg-brand-primary text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className={`card overflow-hidden ₱{
                !item.is_available ? 'opacity-60' : ''
              }`}
            >
              {item.image && (
                <div className="relative h-48 bg-slate-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {!item.is_available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                        UNAVAILABLE
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-5">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-slate-900">{item.name}</h3>
                    <span className="text-xl font-bold text-brand-primary">
                      ₱{item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                    {item.description}
                  </p>
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                    {item.category}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleAvailability(item.id, item.is_available)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-semibold text-sm transition ₱{
                      item.is_available
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Power className="w-4 h-4" />
                    <span>{item.is_available ? 'Available' : 'Unavailable'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal(item)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Items Found</h3>
            <p className="text-slate-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="e.g., Nasi Goreng"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input resize-none"
                  rows={3}
                  placeholder="Describe the dish..."
                />
              </div>

              {/* Price & Category */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input"
                  >
                    <option value="Main Dishes">Main Dishes</option>
                    <option value="Appetizers">Appetizers</option>
                    <option value="Soups">Soups</option>
                    <option value="Salads">Salads</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="input"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Use Unsplash or other image URLs
                </p>
              </div>

              {/* Availability */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="w-5 h-5 text-brand-primary rounded focus:ring-2 focus:ring-brand-primary"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Item is available for ordering
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-semibold rounded-xl transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{editingItem ? 'Update Item' : 'Add Item'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


