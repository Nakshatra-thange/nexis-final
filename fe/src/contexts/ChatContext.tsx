import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'
import {
  sendMessage as sendChatMessage,
  getConversations as fetchConversations,
  getConversation as fetchConversation,
  deleteConversation as removeConversation
} from '../services/chatService'

type Conversation = {
  id: string
  title: string | null
  updatedAt: string
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
  metadata?: {
    transactionId?: string
    requiresApproval?: boolean
  }
}

type ChatState = {
  conversations: Conversation[]
  currentConversationId: string | null
  messages: Message[]
  isSending: boolean
  isLoadingMessages: boolean
  error: string | null
}

type ChatContextType = ChatState & {
  sendMessage: (text: string) => Promise<void>
  loadConversation: (id: string) => Promise<void>
  createNewConversation: () => void
  deleteConversation: (id: string) => Promise<void>
  loadConversations: () => Promise<void>
}

const ChatContext = createContext<ChatContextType | null>(
  null
)

export function ChatProvider({
  children
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useAuth()

  const [conversations, setConversations] =
    useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] =
    useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>(
    []
  )
  const [isSending, setIsSending] =
    useState(false)
  const [isLoadingMessages, setIsLoadingMessages] =
    useState(false)
  const [error, setError] = useState<string | null>(
    null
  )

  async function loadConversations() {
    const data = await fetchConversations()
    setConversations(data)
  }

  async function loadConversation(id: string) {
    if (id === currentConversationId) return

    setIsLoadingMessages(true)
    setMessages([])
    setCurrentConversationId(id)

    try {
      const data = await fetchConversation(id)
      setMessages(data.messages || [])
    } finally {
      setIsLoadingMessages(false)
    }
  }

  function createNewConversation() {
    setCurrentConversationId(null)
    setMessages([])
  }

  async function deleteConversation(id: string) {
    await removeConversation(id)
    setConversations(prev =>
      prev.filter(c => c.id !== id)
    )
    if (id === currentConversationId) {
      createNewConversation()
    }
  }

  async function sendMessage(text: string) {
    if (!text.trim()) return

    const tempId = `temp-${Date.now()}`
    const tempMessage: Message = {
      id: tempId,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString()
    }

    setMessages(prev => [...prev, tempMessage])
    setIsSending(true)
    setError(null)

    try {
      const res = await sendChatMessage(
        text,
        currentConversationId
      )

      const userMessage: Message = {
        ...tempMessage,
        id: `user-${Date.now()}`
      }

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.message,
        createdAt: new Date().toISOString(),
        metadata: res.transactionId
          ? {
              transactionId: res.transactionId,
              requiresApproval: res.requiresApproval
            }
          : undefined
      }

      setMessages(prev => {
        const withoutTemp = prev.filter(
          msg => msg.id !== tempId
        )
        return [...withoutTemp, userMessage, aiMessage]
      })

      setCurrentConversationId(res.conversationId)

      setConversations(prev => {
        const updatedAt = new Date().toISOString()
        const existing = prev.find(
          c => c.id === res.conversationId
        )

        if (existing) {
          return prev.map(c =>
            c.id === res.conversationId
              ? { ...c, updatedAt }
              : c
          )
        }

        return [
          {
            id: res.conversationId,
            title: null,
            updatedAt
          },
          ...prev
        ]
      })
    } catch (err: any) {
      setMessages(prev =>
        prev.filter(msg => msg.id !== tempId)
      )
      const message =
        err?.message || 'Failed to send message'
      setError(message)
      toast.error(message)
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations()
    } else {
      setConversations([])
      setCurrentConversationId(null)
      setMessages([])
      setError(null)
    }
  }, [isAuthenticated])

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversationId,
        messages,
        isSending,
        isLoadingMessages,
        error,
        sendMessage,
        loadConversation,
        createNewConversation,
        deleteConversation,
        loadConversations
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) {
    throw new Error(
      'useChat must be used inside ChatProvider'
    )
  }
  return ctx
}
