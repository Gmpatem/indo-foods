'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Database, ShoppingCart, Users, Code, CheckCircle, XCircle } from 'lucide-react';

export default function DevPortal() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const router = useRouter();

  useEffect(() => {
    // Check authorization
    const isDev = process.env.NODE_ENV === 'development';
    const hash = window.location.hash.slice(1);
    const devSecret = process.env.NEXT_PUBLIC_DEV_SECRET;

    if (isDev || hash === devSecret) {
      setIsAuthorized(true);
    } else {
      router.push('/');
    }

    checkDatabase();
  }, [router]);

  const checkDatabase = async () => {
    try {
      const response = await fetch('/api/health');
      if (response.ok) {
        setDbStatus('connected');
      } else {
        setDbStatus('error');
      }
    } catch (error) {
      setDbStatus('error');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const modules = [
    {
      title: 'Online Ordering System',
      description: 'Public-facing menu and checkout',
      icon: ShoppingCart,
      color: 'bg-emerald-500',
      links: [
        { label: 'Landing Page', href: '/' },
        { label: 'Menu', href: '/menu' },
        { label: 'Checkout', href: '/checkout' },
      ]
    },
    {
      title: 'POS System',
      description: 'Point of Sale for staff (PIN protected)',
      icon: Database,
      color: 'bg-blue-500',
      links: [
        { label: 'POS Dashboard', href: '/pos' },
      ],
      note: `PIN: ${process.env.NEXT_PUBLIC_POS_PIN}`
    },
    {
      title: 'Admin Panel',
      description: 'Management dashboard (Auth required)',
      icon: Users,
      color: 'bg-purple-500',
      links: [
        { label: 'Admin Login', href: '/auth/login' },
        { label: 'Admin Dashboard', href: '/admin' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Code className="w-8 h-8 text-emerald-400" />
              <div>
                <h1 className="text-2xl font-bold">Developer Portal</h1>
                <p className="text-slate-400 text-sm">Indo Foods - System Testing</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {dbStatus === 'checking' && (
                <div className="flex items-center gap-2 text-yellow-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                  <span className="text-sm">Checking DB...</span>
                </div>
              )}
              {dbStatus === 'connected' && (
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Database Connected</span>
                </div>
              )}
              {dbStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-400">
                  <XCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Database Error</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Environment</p>
              <p className="font-mono font-bold text-emerald-400">{process.env.NODE_ENV}</p>
            </div>
            <div>
              <p className="text-slate-400">URL</p>
              <p className="font-mono text-blue-400">{window.location.origin}</p>
            </div>
            <div>
              <p className="text-slate-400">POS PIN</p>
              <p className="font-mono text-purple-400">{process.env.NEXT_PUBLIC_POS_PIN}</p>
            </div>
            <div>
              <p className="text-slate-400">Access Level</p>
              <p className="font-mono text-yellow-400">DEVELOPER</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, idx) => (
            <div
              key={idx}
              className="bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`${module.color} p-3 rounded-lg`}>
                  <module.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{module.title}</h3>
                  <p className="text-slate-400 text-sm">{module.description}</p>
                </div>
              </div>

              <div className="space-y-2">
                {module.links.map((link, linkIdx) => (
                  <Link
                    key={linkIdx}
                    href={link.href}
                    className="block px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-sm"
                  >
                    → {link.label}
                  </Link>
                ))}
              </div>

              {module.note && (
                <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-sm font-mono">{module.note}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-slate-800/30 backdrop-blur rounded-xl border border-slate-700">
          <h3 className="text-lg font-bold mb-4">🛠️ Developer Tools</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                alert('Cache cleared!');
              }}
              className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-sm transition-colors"
            >
              🗑️ Clear Cache/Storage
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-sm transition-colors"
            >
              🔄 Reload Page
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 rounded-lg text-sm transition-colors"
            >
              🏠 Go to Home
            </button>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <h3 className="text-lg font-bold mb-2">🔐 Production Access</h3>
          <p className="text-slate-300 text-sm mb-2">
            In production, access this portal using the secret hash:
          </p>
          <code className="block p-3 bg-slate-900 rounded-lg text-emerald-400 text-sm font-mono">
            https://yoursite.com/dev-portal#{process.env.NEXT_PUBLIC_DEV_SECRET}
          </code>
          <p className="text-slate-400 text-xs mt-2">
            💡 Bookmark this URL to access the portal on your live site
          </p>
        </div>
      </div>
    </div>
  );
}

