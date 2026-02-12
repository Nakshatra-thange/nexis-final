import { useState } from 'react';

interface Props {
  transaction: {
    id: string;
    from: string;
    to: string;
    amount: string;
    fee: string;
    status: string;
    type: string;
    time: string;
    date: string;
  };
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: '● Pending Approval' },
  submitted: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: '⟳ Confirming...' },
  confirmed: { bg: 'bg-green-500/10', text: 'text-green-400', label: '✓ Confirmed' },
  failed: { bg: 'bg-red-500/10', text: 'text-red-400', label: '✕ Failed' },
  cancelled: { bg: 'bg-gray-500/10', text: 'text-gray-400', label: '— Cancelled' },
};

const TransactionCard = ({ transaction }: Props) => {
  const [status, setStatus] = useState(transaction.status);
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className="mt-2 bg-app-bg border border-app-border rounded-2xl overflow-hidden max-w-full">
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-app-surface">
        <span className={`${config.bg} ${config.text} rounded-full px-3 py-1 text-xs font-medium`}>
          {config.label}
        </span>
        {status === 'pending' && (
          <span className="text-[10px] text-app-text-muted">⏱ 14:30</span>
        )}
      </div>

      {/* Details */}
      <div className="px-4 py-3 grid grid-cols-2 gap-y-2 text-xs">
        <span className="text-app-text-muted uppercase tracking-wide">From</span>
        <span className="text-app-text font-mono text-right">{transaction.from}</span>
        <span className="text-app-text-muted uppercase tracking-wide">To</span>
        <span className="text-app-text font-mono text-right">{transaction.to}</span>
        <span className="text-app-text-muted uppercase tracking-wide">Amount</span>
        <span className="text-cherry-soda font-medium text-right">{transaction.amount}</span>
        <span className="text-app-text-muted uppercase tracking-wide">Network Fee</span>
        <span className="text-app-text text-right">{transaction.fee}</span>
        <span className="text-app-text-muted uppercase tracking-wide">Total</span>
        <span className="text-app-text font-bold text-right">0.500005 SOL</span>
      </div>

      {/* Actions */}
      {status === 'pending' && (
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => setStatus('confirmed')}
            className="flex-1 gradient-pink text-white font-semibold py-2.5 rounded-xl hover:glow-pink-strong transition-all duration-200 text-sm"
          >
            Approve & Sign
          </button>
          <button
            onClick={() => setStatus('cancelled')}
            className="flex-1 border border-app-border text-app-text-muted py-2.5 rounded-xl hover:border-red-400/50 hover:text-red-400 transition-all duration-200 text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {status === 'confirmed' && (
        <div className="px-4 pb-4">
          <a href="#" className="text-cherry-soda text-sm hover:underline text-bubbly">
            View on Solana Explorer →
          </a>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
