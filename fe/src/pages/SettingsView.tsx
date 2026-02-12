import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const SettingsView = () => {
  const { user } = useAppContext();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(user.walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full overflow-y-auto flex justify-center py-8 px-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-app-text text-bubbly">Settings</h1>

        {/* Wallet Section */}
        <div className="bg-app-surface border border-app-border rounded-2xl p-5 space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-app-text-muted font-medium">Wallet</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-app-text-muted">Connected Wallet</span>
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Connected
            </span>
          </div>
          <p className="text-xs text-app-text-muted font-mono break-all">{user.walletAddress}</p>
          <button
            onClick={copyAddress}
            className="flex items-center gap-2 px-3 py-2 border border-app-border rounded-xl text-xs text-app-text-muted hover:text-cherry-soda hover:border-cherry-soda/40 transition-all duration-200"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Address'}
          </button>
        </div>

        {/* Account Section */}
        <div className="bg-app-surface border border-app-border rounded-2xl p-5 space-y-3">
          <h3 className="text-xs uppercase tracking-wider text-app-text-muted font-medium">Account</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-app-text-muted">Member since</span>
            <span className="text-sm text-app-text">Feb 2024</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-app-text-muted">Network</span>
            <span className="text-xs bg-cherry-soda/10 text-cherry-soda px-2 py-0.5 rounded-full font-medium">Devnet</span>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-app-surface border border-red-500/20 rounded-2xl p-5">
          <h3 className="text-xs uppercase tracking-wider text-app-text-muted font-medium mb-4">Danger Zone</h3>
          <button className="w-full border border-red-500/30 text-red-400 py-2.5 rounded-xl text-sm font-medium hover:bg-red-500/10 transition-all duration-200">
            Disconnect Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
