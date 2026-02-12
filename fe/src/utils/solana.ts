import { PublicKey } from '@solana/web3.js'

/**
 * Truncates a Solana wallet address for display
 * e.g. "9HgX9mPqR4sN3vL8" → "9HgX...vL8"
 */
export function truncateAddress(address, chars = 4) {
  if (!address) return ''
  if (address.length <= chars * 2) return address
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

/**
 * Truncates a Solana transaction signature for display
 * Signatures are longer so default is 8 chars each side
 */
export function truncateSignature(signature, chars = 8) {
  if (!signature) return ''
  if (signature.length <= chars * 2) return signature
  return `${signature.slice(0, chars)}...${signature.slice(-chars)}`
}

/**
 * Converts lamports to SOL
 * 1 SOL = 1,000,000,000 lamports
 */
export function lamportsToSol(lamports) {
  if (lamports === null || lamports === undefined) return 0
  return Number(lamports) / 1_000_000_000
}

/**
 * Converts SOL to lamports
 * Uses Math.floor to avoid floating point precision issues
 */
export function solToLamports(sol) {
  if (!sol) return 0
  return Math.floor(Number(sol) * 1_000_000_000)
}

/**
 * Formats a SOL amount to a fixed decimal string
 * e.g. 2.45 → "2.4500"
 */
export function formatSol(amount, decimals = 4) {
  if (amount === null || amount === undefined) return '0.0000'
  return Number(amount).toFixed(decimals)
}

/**
 * Returns Solana Explorer URL for a transaction
 * Automatically appends cluster param for devnet
 */
export function getExplorerTxUrl(signature) {
  if (!signature) return '#'
  const baseUrl = import.meta.env.VITE_EXPLORER_URL || 'https://explorer.solana.com'
  const network = import.meta.env.VITE_SOLANA_NETWORK || 'devnet'
  const clusterParam = network === 'mainnet-beta' ? '' : `?cluster=${network}`
  return `${baseUrl}/tx/${signature}${clusterParam}`
}

/**
 * Returns Solana Explorer URL for a wallet address
 * Automatically appends cluster param for devnet
 */
export function getExplorerAddressUrl(address) {
  if (!address) return '#'
  const baseUrl = import.meta.env.VITE_EXPLORER_URL || 'https://explorer.solana.com'
  const network = import.meta.env.VITE_SOLANA_NETWORK || 'devnet'
  const clusterParam = network === 'mainnet-beta' ? '' : `?cluster=${network}`
  return `${baseUrl}/address/${address}${clusterParam}`
}

/**
 * Validates a Solana wallet address
 * Tries to create a PublicKey — throws if invalid
 */
export function isValidSolanaAddress(address) {
  if (!address || typeof address !== 'string') return false
  try {
    new PublicKey(address)
    return true
  } catch {
    return false
  }
}