import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Conversation {
  id: string;
  title: string;
  time: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  transaction?: Transaction;
}

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  fee: string;
  status: 'pending' | 'submitted' | 'confirmed' | 'failed' | 'cancelled';
  type: 'sent' | 'received';
  time: string;
  date: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  user: { walletAddress: string };
  balance: { sol: number; usd: number };
  conversations: Conversation[];
  messages: Message[];
  transactions: Transaction[];
  disconnect: () => void;
  sendMessage: (msg: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const mockConversations: Conversation[] = [
  { id: 'mock-1', title: "What's my SOL balance?", time: '2 hours ago' },
  { id: 'mock-2', title: 'Sent SOL to Alice', time: 'Yesterday' },
  { id: 'mock-3', title: 'Transaction history check', time: 'Feb 10' },
];

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: "What's my current balance?",
    timestamp: '10:24 AM',
  },
  {
    id: '2',
    role: 'assistant',
    content: "You currently have:\n\n**2.45 SOL** (~$340 USD)\n\n**Tokens:**\n• 150.00 USDC\n• 5.20 RAY",
    timestamp: '10:24 AM',
  },
  {
    id: '3',
    role: 'user',
    content: 'Send 0.5 SOL to my friend',
    timestamp: '10:25 AM',
  },
  {
    id: '4',
    role: 'assistant',
    content: "I've prepared a transfer of **0.5 SOL**. Please review and approve below.",
    timestamp: '10:25 AM',
    transaction: {
      id: 'tx-1',
      from: '9HgX...Km8P',
      to: '7xKj...2mQ',
      amount: '0.5 SOL',
      fee: '~0.000005 SOL',
      status: 'pending',
      type: 'sent',
      time: '10:25 AM',
      date: 'Today',
    },
  },
];

const mockTransactions: Transaction[] = [
  { id: 'tx-1', from: '9HgX...Km8P', to: '7xKj...2mQ', amount: '0.5 SOL', fee: '~0.000005 SOL', status: 'confirmed', type: 'sent', time: '2h ago', date: 'Today' },
  { id: 'tx-2', from: '9HgX...Km8P', to: '9HgX...Km8P', amount: '1.2 SOL', fee: '~0.000005 SOL', status: 'confirmed', type: 'received', time: '3:15 PM', date: 'Yesterday' },
  { id: 'tx-3', from: '9HgX...Km8P', to: 'abc...xyz', amount: '0.1 SOL', fee: '~0.000005 SOL', status: 'failed', type: 'sent', time: '1:00 PM', date: 'Feb 10' },
];

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const value: AppContextType = {
    isAuthenticated: true,
    user: { walletAddress: '9HgXmPqR4sN3vL8tY2wE6fH1gJ5kD3cA' },
    balance: { sol: 2.45, usd: 340 },
    conversations: mockConversations,
    messages: mockMessages,
    transactions: mockTransactions,
    disconnect: () => { /* TODO */ },
    sendMessage: () => { /* TODO */ },
    sidebarOpen,
    setSidebarOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
