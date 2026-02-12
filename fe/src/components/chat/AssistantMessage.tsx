import TransactionCard from '../transaction/TransactionCard';

interface Props {
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

const AssistantMessage = ({ content, timestamp, transaction }: Props) => {
  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Bold
      const processed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Bullet
      if (line.startsWith('• ')) {
        return (
          <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{ __html: processed.slice(2) }} />
        );
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  return (
    <div className="flex justify-start gap-3">
      <div className="w-8 h-8 rounded-full gradient-pink flex items-center justify-center shrink-0 text-white text-xs font-bold">
        S
      </div>
      <div className="max-w-[65%]">
        <div className="bg-app-surface border border-app-border rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-app-text text-bubbly">
          {renderContent(content)}
        </div>
        {transaction && <TransactionCard transaction={transaction} />}
        <p className="text-[10px] text-app-text-muted mt-1">{timestamp}</p>
      </div>
    </div>
  );
};

export default AssistantMessage;
