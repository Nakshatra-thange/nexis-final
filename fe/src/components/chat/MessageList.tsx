import UserMessage from './UserMessage';
import AssistantMessage from './AssistantMessage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  transaction?: {
    id: string;
    from: string;
    to: string;
    amount: string;
    fee: string;
    status: string;
    type: string;
    time: string;
    date: string;
  };
}

const MessageList = ({ messages }: { messages: Message[] }) => {
  return (
    <div className="px-6 py-4 space-y-4">
      {messages.map((msg) =>
        msg.role === 'user' ? (
          <UserMessage key={msg.id} content={msg.content} timestamp={msg.timestamp} />
        ) : (
          <AssistantMessage
            key={msg.id}
            content={msg.content}
            timestamp={msg.timestamp}
            transaction={msg.transaction}
          />
        )
      )}
    </div>
  );
};

export default MessageList;
