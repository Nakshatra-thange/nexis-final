// ─── Transaction Statuses ────────────────────────────────────────────────────
export const TX_STATUS = {
    PENDING:   'PENDING',    // Created, waiting for user approval
    APPROVED:  'APPROVED',   // User approved in UI, not yet signed
    SIGNED:    'SIGNED',     // Wallet has signed the transaction
    SUBMITTED: 'SUBMITTED',  // Sent to Solana network
    CONFIRMED: 'CONFIRMED',  // Finalized on blockchain
    FAILED:    'FAILED',     // Transaction failed on-chain
    EXPIRED:   'EXPIRED',    // User didn't approve in time
    CANCELLED: 'CANCELLED',  // User explicitly cancelled
  }
  
  // ─── Transaction Types ────────────────────────────────────────────────────────
  export const TX_TYPE = {
    TRANSFER_SOL:   'TRANSFER_SOL',
    TRANSFER_TOKEN: 'TRANSFER_TOKEN',
    SWAP:           'SWAP',
    STAKE:          'STAKE',
    NFT_TRANSFER:   'NFT_TRANSFER',
  }
  
  // ─── Message Roles ────────────────────────────────────────────────────────────
  export const MSG_ROLE = {
    USER:      'user',
    ASSISTANT: 'assistant',
  }
  
  // ─── App Routes ───────────────────────────────────────────────────────────────
  export const ROUTES = {
    HOME:         '/',
    APP:          '/app',
    HISTORY:      '/app/history',
    SETTINGS:     '/app/settings',
    CONVERSATION: '/app/c/:id',   // use ROUTES.CONVERSATION.replace(':id', id)
  }
  
  // ─── Local Storage Keys ───────────────────────────────────────────────────────
  export const STORAGE_KEYS = {
    AUTH_TOKEN: 'nexis_auth_token',
    THEME:      'nexis_theme',
  }
  
  // ─── Polling Configuration ────────────────────────────────────────────────────
  export const POLLING_INTERVAL_MS  = 2000  // 2 seconds between status checks
  export const POLLING_MAX_ATTEMPTS = 60    // Stop after 60 attempts (2 minutes)
  
  // ─── Transaction Expiry ───────────────────────────────────────────────────────
  export const TX_EXPIRY_MINUTES = 15       // Pending transactions expire after 15 min
  
  // ─── API Configuration ────────────────────────────────────────────────────────
  export const API_TIMEOUT_MS = 30_000      // 30 second request timeout
  
  // ─── Chat Configuration ───────────────────────────────────────────────────────
  export const MAX_MESSAGE_LENGTH  = 5000   // Max chars per user message
  export const CONVERSATION_HISTORY_LIMIT = 10  // How many past messages to load
  
  // ─── Balance Auto-Refresh ─────────────────────────────────────────────────────
  export const BALANCE_REFRESH_INTERVAL_MS = 30_000  // Refresh balance every 30s