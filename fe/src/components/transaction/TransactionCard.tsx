import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import api from "@/services/api";

interface Props {
  transaction: any;
}

const statusConfig: Record<string, any> = {
  PENDING: { bg: "bg-yellow-500/10", text: "text-yellow-400", label: "● Pending Approval" },
  SUBMITTED: { bg: "bg-blue-500/10", text: "text-blue-400", label: "⟳ Confirming..." },
  CONFIRMED: { bg: "bg-green-500/10", text: "text-green-400", label: "✓ Confirmed" },
  FAILED: { bg: "bg-red-500/10", text: "text-red-400", label: "✕ Failed" },
  CANCELLED: { bg: "bg-gray-500/10", text: "text-gray-400", label: "— Cancelled" },
};

export default function TransactionCard({ transaction }: Props) {
  const { signTransaction } = useWallet();
  const [status, setStatus] = useState(transaction.status);

  const config = statusConfig[status] || statusConfig.PENDING;

  async function approve() {
    if (!signTransaction) return;

    const raw = Buffer.from(transaction.unsignedTx, "base64");
    const tx = Transaction.from(raw);

    const signed = await signTransaction(tx);

    const signedBase64 = Buffer.from(signed.serialize()).toString("base64");

    await api.post(`/api/transactions/${transaction.id}/submit`, {
      signedTransaction: signedBase64,
    });

    setStatus("SUBMITTED");
  }

  async function cancel() {
    await api.post(`/api/transactions/${transaction.id}/cancel`);
    setStatus("CANCELLED");
  }

  return (
    <div className="mt-2 bg-app-bg border border-app-border rounded-2xl overflow-hidden">
      <div className="flex justify-between px-4 py-2.5 bg-app-surface">
        <span className={`${config.bg} ${config.text} rounded-full px-3 py-1 text-xs`}>
          {config.label}
        </span>
      </div>

      {status === "PENDING" && (
        <div className="px-4 pb-4 flex gap-2">
          <button onClick={approve} className="flex-1 gradient-pink text-white py-2.5 rounded-xl">
            Approve & Sign
          </button>
          <button onClick={cancel} className="flex-1 border border-app-border py-2.5 rounded-xl">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
