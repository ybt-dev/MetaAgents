import { tailwindClsx } from '@/utils';

export interface TypingIndicatorProps {
  className?: string;
}

const TypingIndicator = ({ className }: TypingIndicatorProps) => {
  return (
    <div className={tailwindClsx('flex items-center space-x-2 text-gray-400 bg-gray-800/30 rounded-lg p-4', className)}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm">Waiting for agents' messages...</span>
    </div>
  );
};

export default TypingIndicator;
