import { useParams } from 'react-router-dom';
import { Sparkles, Send, Clock } from 'lucide-react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useChat } from '@/contexts/ChatContext';
import { useEffect } from 'react';
const ChatView = () => {
  const { id } = useParams();
  const { messages, isSending } = useChat();

  const showMessages = messages.length > 0;
  const { loadConversation } = useChat();

  useEffect(() => {
  if (id) {
    loadConversation(id);
  }
  }, [id]);


  return (
    <div className="flex flex-col h-full">
      {showMessages ? (
        <>
          <div className="flex-1 overflow-y-auto">
            {/* ✅ FIXED: Changed 'message' to 'messages' */}
            <MessageList messages={messages} />
          </div>
          <ChatInput />
        </>
      ) : (
        <>
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-app-text mb-2 text-bubbly">
              How can I help you today?
            </h2>
            <p className="text-app-text-muted text-sm mb-10 text-bubbly">
              Ask me anything about your Solana wallet
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl w-full">
              <SuggestionCard
                icon={<Sparkles className="w-5 h-5 text-cherry-soda" />}
                text="What's my current balance?"
              />
              <SuggestionCard
                icon={<Send className="w-5 h-5 text-cherry-soda" />}
                text="Send SOL to a friend"
              />
              <SuggestionCard
                icon={<Clock className="w-5 h-5 text-cherry-soda" />}
                text="View recent transactions"
              />
            </div>
          </div>
          <ChatInput />
        </>
      )}
    </div>
  );
};

const SuggestionCard = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <button className="bg-app-surface border border-app-border rounded-2xl p-4 text-left hover:border-cherry-soda/40 hover:glow-pink transition-all duration-300 group cursor-pointer">
    <div className="mb-3">{icon}</div>
    <p className="text-sm text-app-text text-bubbly group-hover:text-cherry-soda transition-colors">{text}</p>
  </button>
);

export default ChatView;