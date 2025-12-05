import { getMenuItems, getAllCategories } from '@/lib/db';
import POSClient from './POSClient';

export default async function POSPage() {
  const items = await getMenuItems();
  const categories = await getAllCategories();

  return <POSClient items={items} categories={categories} />;
}
