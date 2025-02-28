import { useState, FormEvent, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { tailwindClsx } from '@/utils';

export interface MessageInputProps {
  className?: string;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const MessageInput = ({ className, onSendMessage, disabled }: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (message.trim()) {
      onSendMessage(message);

      setMessage('');
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      handleSubmit(event);
    }
  };

  return (
    <div className={tailwindClsx('border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm p-4', className)}>
      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl">
        <div className="flex gap-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? 'Waiting for agents to respond...' : 'Type your message...'}
            className="flex-1 min-h-[2.5rem] max-h-32 rounded-lg bg-gray-800 px-4 py-2 text-gray-100 placeholder-gray-400 border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            rows={1}
          />
          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
