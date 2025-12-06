'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Settings, Building2, Shield, Key, Save, CheckCircle, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('business');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [user, setUser] = useState<any>(null);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [businessName, setBusinessName] = useState('Indo Foods');
  const [businessEmail, setBusinessEmail] = useState('contact@indofoods.com');
  const [businessPhone, setBusinessPhone] = useState('+63 123 456 7890');
  const [businessAddress, setBusinessAddress] = useState('Davao City, Philippines');

  const [currentPosPin, setCurrentPosPin] = useState(process.env.NEXT_PUBLIC_POS_PIN || '1234');
  const [newPosPin, setNewPosPin] = useState('');
  const [confirmPosPin, setConfirmPosPin] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleSaveBusinessSettings = async () => {
    setIsLoading(true);
    setMessage(null);
    setTimeout(() => {
      setMessage({ type: 'success', text: 'Business settings saved successfully!' });
      setIsLoading(false);
    }, 1000);
  };

  const handleChangePosPin = () => {
    if (newPosPin.length !== 4) {
      setMessage({ type: 'error', text: 'PIN must be exactly 4 digits' });
      return;
    }
    if (newPosPin !== confirmPosPin) {
      setMessage({ type: 'error', text: 'PINs do not match' });
      return;
    }
    setMessage({ 
      type: 'success', 
      text: `POS PIN would be changed to ${newPosPin}. Update in .env.local: NEXT_PUBLIC_POS_PIN=${newPosPin}` 
    });
    setNewPosPin('');
    setConfirmPosPin('');
  };

  const tabs = [
    { id: 'business', label: 'Business Info', icon: Building2 },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'account', label: 'My Account', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Settings</h1>
          </div>
          <p className="text-slate-400">Manage your restaurant and system settings</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/50' 
              : 'bg-red-500/10 border border-red-500/50'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
              {message.text}
            </p>
          </div>
        )}

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700 p-6">
          
          {activeTab === 'business' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Business Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Restaurant Name</label>
                <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Contact Email</label>
                <input type="email" value={businessEmail} onChange={(e) => setBusinessEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                <input type="tel" value={businessPhone} onChange={(e) => setBusinessPhone(e.target.value)} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Address</label>
                <textarea value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} rows={3} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>

              <button onClick={handleSaveBusinessSettings} disabled={isLoading} className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">Security Settings</h2>
              
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-400" />
                  POS PIN Code
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Current PIN: <span className="font-mono text-purple-400">{currentPosPin}</span>
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">New PIN (4 digits)</label>
                    <input type="password" value={newPosPin} onChange={(e) => setNewPosPin(e.target.value.slice(0, 4))} placeholder="Enter new 4-digit PIN" maxLength={4} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New PIN</label>
                    <input type="password" value={confirmPosPin} onChange={(e) => setConfirmPosPin(e.target.value.slice(0, 4))} placeholder="Re-enter new PIN" maxLength={4} className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>

                  <button onClick={handleChangePosPin} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">Update POS PIN</button>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm">⚠️ <strong>Note:</strong> After changing the PIN, update it in .env.local and restart the dev server.</p>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-4">My Account</h2>
              
              <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 space-y-3">
                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Role</p>
                  <span className="inline-block px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-400 text-sm font-medium">Admin</span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Account Created</p>
                  <p className="text-white">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>

              <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/auth/login'; }} className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">Sign Out</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
