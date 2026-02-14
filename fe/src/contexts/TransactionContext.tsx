import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { toast } from 'sonner'
import { getTransaction } from '@/services/transactionService'
import { useBalance } from './BalanceContext'
import { TX_STATUS, POLLING_INTERVAL_MS, POLLING_MAX_ATTEMPTS } from '@/constants'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Transaction {
  id: string
  userId: string
  conversationId?: string
  status: string
  type: string
  fromAddress: string
  toAddress: string
  amount: string        // string because BigInt serialized from backend
  fee?: string
  memo?: string
  signature?: string
  blockTime?: string
  slot?: string
  unsignedTx?: string   // base64, only present when status is PENDING
  errorMessage?: string
  createdAt: string
  expiresAt?: string
  confirmedAt?: string
}

interface TransactionState {
  activeTransactionId: string | null
  pollingIds: Set<string>
  transactions: Record<string, Transaction>
}

interface TransactionContextValue {
  activeTransactionId: string | null
  transactions: Record<string, Transaction>
  openApproval: (transactionId: string) => void
  closeApproval: () => void
  startPolling: (transactionId: string) => void
  stopPolling: (transactionId: string) => void
  updateTransaction: (transaction: Transaction) => void
  getTransactionById: (id: string) => Transaction | undefined
}

// ─── Context ──────────────────────────────────────────────────────────────────

const TransactionContext = createContext<TransactionContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function TransactionProvider({ children }: { children: ReactNode }) {
  const { refreshBalance } = useBalance()

  const [state, setState] = useState<TransactionState>({
    activeTransactionId: null,
    pollingIds: new Set(),
    transactions: {},
  })

  // Track intervals so we can clear them — keyed by transactionId
  const intervalsRef = useRef<Record<string, ReturnType<typeof setInterval>>>({})
  // Track attempt counts per transaction
  const attemptsRef = useRef<Record<string, number>>({})

  // ─── openApproval / closeApproval ─────────────────────────────────────────

  function openApproval(transactionId: string) {
    setState(s => ({ ...s, activeTransactionId: transactionId }))
  }

  function closeApproval() {
    setState(s => ({ ...s, activeTransactionId: null }))
  }

  // ─── updateTransaction ────────────────────────────────────────────────────

  function updateTransaction(transaction: Transaction) {
    setState(s => ({
      ...s,
      transactions: { ...s.transactions, [transaction.id]: transaction },
    }))
  }

  function getTransactionById(id: string): Transaction | undefined {
    return state.transactions[id]
  }

  // ─── stopPolling (internal + exported) ────────────────────────────────────

  function stopPolling(transactionId: string) {
    // Clear the interval for this specific transaction
    if (intervalsRef.current[transactionId]) {
      clearInterval(intervalsRef.current[transactionId])
      delete intervalsRef.current[transactionId]
    }
    // Clean up attempt counter
    delete attemptsRef.current[transactionId]

    // Remove from pollingIds set
    setState(s => {
      const next = new Set(s.pollingIds)
      next.delete(transactionId)
      return { ...s, pollingIds: next }
    })
  }

  // ─── startPolling ─────────────────────────────────────────────────────────

  function startPolling(transactionId: string) {
    // Don't double-poll
    if (intervalsRef.current[transactionId]) return

    attemptsRef.current[transactionId] = 0

    // Add to set to trigger re-render so components know polling is active
    setState(s => {
      const next = new Set(s.pollingIds)
      next.add(transactionId)
      return { ...s, pollingIds: next }
    })

    const interval = setInterval(async () => {
      attemptsRef.current[transactionId] = (attemptsRef.current[transactionId] ?? 0) + 1

      // Safety valve — stop after max attempts to avoid polling forever
      if (attemptsRef.current[transactionId] > POLLING_MAX_ATTEMPTS) {
        console.warn(`[TransactionContext] Polling timeout for ${transactionId}`)
        stopPolling(transactionId)
        return
      }

      try {
        const tx = await getTransaction(transactionId)
        updateTransaction(tx)

        switch (tx.status) {
          case TX_STATUS.CONFIRMED:
            stopPolling(transactionId)
            toast.success('Transaction confirmed! ✓')
            // Refresh balance since SOL amount changed
            refreshBalance()
            break

          case TX_STATUS.FAILED:
            stopPolling(transactionId)
            toast.error(`Transaction failed${tx.errorMessage ? `: ${tx.errorMessage}` : ''}`)
            break

          case TX_STATUS.CANCELLED:
          case TX_STATUS.EXPIRED:
            stopPolling(transactionId)
            break

          default:
            // Still SUBMITTED — keep polling
            break
        }
      } catch (err) {
        console.error(`[TransactionContext] Poll error for ${transactionId}:`, err)
        // Don't stop polling on network errors — retry next interval
      }
    }, POLLING_INTERVAL_MS)

    intervalsRef.current[transactionId] = interval
  }

  // 🟣 ADD THIS NEW EFFECT HERE — Reload transactions when a new one is created
  useEffect(() => {
    const reload = () => {
      // You might want to refresh the transaction list or trigger a specific action
      console.log('Transaction created — refreshing')
      // Optionally trigger a refresh of the active transaction if needed
    };

    window.addEventListener("tx-created", reload);

    return () => {
      window.removeEventListener("tx-created", reload);
    };
  }, []);

  // ─── Cleanup all intervals on unmount ────────────────────────────────────

  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval)
      intervalsRef.current = {}
      attemptsRef.current = {}
    }
  }, [])

  return (
    <TransactionContext.Provider
      value={{
        activeTransactionId: state.activeTransactionId,
        transactions: state.transactions,
        openApproval,
        closeApproval,
        startPolling,
        stopPolling,
        updateTransaction,
        getTransactionById,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTransaction(): TransactionContextValue {
  const ctx = useContext(TransactionContext)
  if (!ctx) throw new Error('useTransaction must be used inside <TransactionProvider>')
  return ctx
}