import { useState, useRef, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // ✅ CORRECT: Hook called at top level
  const { sendMessage } = useChat();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSend = async () => {
    if (!message.trim()) return;
  
    const text = message;
    setMessage("");
  
    try {
      await sendMessage(text); // ✅ Now sendMessage is defined
    } catch (err) {
      console.error("Send failed", err);
    }
  };
  
  return (
    <div className="bg-app-bg border-t border-app-border p-4">
      <div className="bg-app-surface border border-app-border rounded-2xl flex items-end gap-2 px-4 py-3 focus-within:border-cherry-soda/50 focus-within:glow-pink transition-all duration-200">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Message Smooth..."
          rows={1}
          className="flex-1 bg-transparent text-app-text text-sm outline-none resize-none placeholder:text-app-text-muted text-bubbly"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className={`w-9 h-9 rounded-full gradient-pink flex items-center justify-center shrink-0 transition-all duration-200 ${
            message.trim()
              ? 'opacity-100 hover:scale-105 glow-pink cursor-pointer'
              : 'opacity-40 cursor-not-allowed'
          }`}
        >
          <ArrowUp className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;