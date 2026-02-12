/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import {
  verifyWallet,
  getStoredToken,
  setStoredToken,
  clearStoredToken,
  isTokenExpired,
  getUserProfile
} from '../services/authService'

type User = {
  id: string
  walletAddress: string
}

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

type AuthContextType = AuthState & {
  login: (
    walletAddress: string,
    signature: string,
    message: string
  ) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(
  null
)

export function AuthProvider({
  children
}: {
  children: React.ReactNode
}) {
  const initialToken = getStoredToken()
  const initialExpired = initialToken
    ? isTokenExpired(initialToken)
    : true

  const [user, setUser] = useState<User | null>(
    null
  )
  const [isAuthenticated, setIsAuthenticated] =
    useState(false)
  const [isLoading, setIsLoading] = useState(
    () => Boolean(initialToken && !initialExpired)
  )

  useEffect(() => {
    const token = getStoredToken()

    if (!token) return

    if (isTokenExpired(token)) {
      clearStoredToken()
      return
    }

    let isActive = true

    async function loadProfile() {
      try {
        const profile = await getUserProfile()
        if (!isActive) return
        setUser(profile)
        setIsAuthenticated(true)
      } catch {
        clearStoredToken()
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      isActive = false
    }
  }, [])

  async function login(
    walletAddress: string,
    signature: string,
    message: string
  ) {
    const res = await verifyWallet(
      walletAddress,
      signature,
      message
    )
    setStoredToken(res.token)
    setUser(res.user)
    setIsAuthenticated(true)
    return res.user
  }

  function logout() {
    clearStoredToken()
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    )
  }
  return ctx
}
