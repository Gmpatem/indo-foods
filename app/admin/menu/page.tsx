import { getAllMenuItems } from '@/lib/db';
import MenuManagementClient from './MenuManagementClient';

export const dynamic = 'force-dynamic';

export default async function MenuManagementPage() {
  const items = await getAllMenuItems();

  return <MenuManagementClient initialItems={items} />;
}
