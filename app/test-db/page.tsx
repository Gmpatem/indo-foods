import { getMenuItems, getAllCategories } from '@/lib/db';
import { CheckCircle, XCircle, Database } from 'lucide-react';

export default async function TestDBPage() {
  let items = null;
  let categories = null;
  let error = null;

  try {
    items = await getMenuItems();
    categories = await getAllCategories();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Unknown error';
  }

  return (
    <div className='min-h-screen bg-slate-50 p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-2'>
            <Database className='w-8 h-8 text-brand-primary' />
            <h1 className='text-3xl font-bold text-slate-900'>Database Connection Test</h1>
          </div>
          <p className='text-slate-600'>Testing Supabase connection and data retrieval</p>
        </div>

        <div className='card p-6 mb-6'>
          <div className='flex items-center gap-3'>
            {error ? (
              <>
                <XCircle className='w-6 h-6 text-red-500' />
                <div>
                  <h2 className='text-lg font-bold text-red-600'>Connection Failed</h2>
                  <p className='text-slate-600 mt-1'>{error}</p>
                  <div className='mt-4 bg-red-50 border border-red-200 rounded-lg p-4'>
                    <p className='text-sm text-red-800 font-semibold mb-2'>Setup Steps:</p>
                    <ol className='text-sm text-red-700 space-y-1 list-decimal list-inside'>
                      <li>Copy .env.example to .env.local</li>
                      <li>Create Supabase account at supabase.com</li>
                      <li>Create new project and get credentials</li>
                      <li>Add credentials to .env.local</li>
                      <li>Run SQL script in Supabase</li>
                      <li>Restart dev server</li>
                    </ol>
                  </div>
                </div>
              </>
            ) : (
              <>
                <CheckCircle className='w-6 h-6 text-green-500' />
                <div>
                  <h2 className='text-lg font-bold text-green-600'>Connected Successfully</h2>
                  <p className='text-slate-600 mt-1'>Database is responding correctly</p>
                </div>
              </>
            )}
          </div>
        </div>

        {categories && categories.length > 0 && (
          <div className='card p-6 mb-6'>
            <h2 className='text-xl font-bold mb-4'>Categories ({categories.length})</h2>
            <div className='flex flex-wrap gap-2'>
              {categories.map((category) => (
                <span key={category} className='px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-lg font-medium'>
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {items && items.length > 0 ? (
          <div className='card p-6'>
            <h2 className='text-xl font-bold mb-4'>Menu Items ({items.length})</h2>
            <div className='grid gap-4'>
              {items.map((item) => (
                <div key={item.id} className='border-b border-slate-200 last:border-0 pb-4 last:pb-0'>
                  <div className='flex justify-between items-start'>
                    <div className='flex-1'>
                      <h3 className='font-bold text-slate-900'>{item.name}</h3>
                      <p className='text-slate-600 text-sm mt-1'>{item.description}</p>
                      <span className='text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded mt-2 inline-block'>
                        {item.category}
                      </span>
                    </div>
                    <span className='text-xl font-bold text-brand-primary ml-4'>
                      \
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !error && (
          <div className='card p-12 text-center'>
            <p className='text-slate-600'>No menu items found in database</p>
            <p className='text-sm text-slate-500 mt-2'>Run the SQL script to insert sample data</p>
          </div>
        )}

        <div className='mt-8 text-center'>
          <a href='/' className='text-brand-primary hover:text-brand-secondary font-semibold'>
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
