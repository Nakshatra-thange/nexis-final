import { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const filters = ['All', 'Confirmed', 'Pending', 'Failed'] as const;

const HistoryView = () => {
  const { transactions } = useAppContext();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filtered = activeFilter === 'All'
    ? transactions
    : transactions.filter((t) => t.status === activeFilter.toLowerCase());

  // Group by date
  const grouped = filtered.reduce<Record<string, typeof transactions>>((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = [];
    acc[tx.date].push(tx);
    return acc;
  }, {});

  return (
    <div className="h-full overflow-y-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-app-text mb-1 text-bubbly">Transaction History</h1>
      <p className="text-sm text-app-text-muted mb-6 text-bubbly">All your wallet activity</p>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              activeFilter === f
                ? 'gradient-pink text-white'
                : 'border border-app-border text-app-text-muted hover:border-cherry-soda/40'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Transaction groups */}
      {Object.entries(grouped).map(([date, txs]) => (
        <div key={date} className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-app-text-muted py-2 font-medium">{date}</p>
          <div className="space-y-2">
            {txs.map((tx) => (
              <div
                key={tx.id}
                className="bg-app-surface border border-app-border rounded-2xl px-4 py-3 flex items-center gap-3 hover:border-cherry-soda/30 hover:glow-pink transition-all duration-200 cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'sent' ? 'bg-cherry-soda/20' : 'bg-green-500/20'
                }`}>
                  {tx.type === 'sent' ? (
                    <ArrowUp className="w-4 h-4 text-cherry-soda" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-green-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-app-text">
                    {tx.type === 'sent' ? 'Sent' : 'Received'} SOL
                  </p>
                  <p className="text-[10px] text-app-text-muted font-mono truncate">{tx.to}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${tx.type === 'sent' ? 'text-cherry-soda' : 'text-green-400'}`}>
                    {tx.type === 'sent' ? '-' : '+'}{tx.amount}
                  </p>
                  <div className="flex items-center justify-end gap-2">
                    <span className={`text-[10px] ${
                      tx.status === 'confirmed' ? 'text-green-400' : tx.status === 'failed' ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {tx.status}
                    </span>
                    <span className="text-[10px] text-app-text-muted">{tx.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-app-text-muted text-sm">No transactions yet</p>
          <p className="text-app-text-muted text-xs mt-1">Your transactions will appear here</p>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
