const UserMessage = ({ content, timestamp }: { content: string; timestamp: string }) => {
  return (
    <div className="flex justify-end">
      <div className="max-w-[65%]">
        <div className="gradient-pink text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-bubbly">
          {content}
        </div>
        <p className="text-[10px] text-app-text-muted mt-1 text-right">{timestamp}</p>
      </div>
    </div>
  );
};

export default UserMessage;
