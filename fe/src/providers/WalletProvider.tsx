import { useMemo } from 'react'
import type { FC, ReactNode } from 'react'

import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  AlphaWalletAdapter,
  
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

type Props = {
  children: ReactNode
}

export const AppWalletProvider: FC<Props> = ({ children }) => {
  const network =
    import.meta.env.VITE_SOLANA_NETWORK === 'mainnet'
      ? 'mainnet-beta'
      : 'devnet'

  const endpoint = useMemo(
    () => clusterApiUrl(network),
    [network]
  )

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new AlphaWalletAdapter(),
      
    ],
    []
  )

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
