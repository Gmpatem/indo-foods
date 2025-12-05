import { getMenuItems, getAllCategories } from '@/lib/db';
import { Suspense } from 'react';
import MenuClient from './MenuClient';

export default async function MenuPage() {
  const items = await getMenuItems();
  const categories = await getAllCategories();

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading menu...</p>
        </div>
      </div>
    }>
      <MenuClient items={items} categories={categories} />
    </Suspense>
  );
}
