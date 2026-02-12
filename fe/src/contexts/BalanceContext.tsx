import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { getBalance } from '../services/walletService'
import { useAuth } from './AuthContext'

type Balance = {
  sol: number
  tokens: any[]
}

type BalanceState = {
  balance: Balance | null
  isLoading: boolean
  lastUpdated: Date | null
}

type BalanceContextType = BalanceState & {
  refreshBalance: () => Promise<void>
}

const BalanceContext =
  createContext<BalanceContextType | null>(null)

export function BalanceProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth()
  const [balance, setBalance] =
    useState<Balance | null>(null)
  const [isLoading, setIsLoading] =
    useState(false)
  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null)
  const intervalRef = useRef<
    ReturnType<typeof setInterval> | null
  >(null)

  async function fetchBalance() {
    setIsLoading(true)
    try {
      const data = await getBalance()
      setBalance(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch balance', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function refreshBalance() {
    await fetchBalance()
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchBalance()
      intervalRef.current = setInterval(
        fetchBalance,
        30_000
      )
    } else {
      setBalance(null)
      setLastUpdated(null)
      setIsLoading(false)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isAuthenticated])

  return (
    <BalanceContext.Provider
      value={{
        balance,
        isLoading,
        lastUpdated,
        refreshBalance
      }}
    >
      {children}
    </BalanceContext.Provider>
  )
}

export function useBalance() {
  const ctx = useContext(BalanceContext)
  if (!ctx) {
    throw new Error(
      'useBalance must be used inside BalanceProvider'
    )
  }
  return ctx
}
