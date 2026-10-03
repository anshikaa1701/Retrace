import React from 'react';
import { User } from 'lucide-react';

interface UserMessageProps {
  text: string;
  timestamp?: string;
}

export const UserMessage: React.FC<UserMessageProps> = ({ text, timestamp }) => {
  return (
    <div className="flex justify-end items-end gap-2 my-2.5 pl-8">
      <div className="flex flex-col items-end space-y-1 max-w-[85%]">
        <div className="px-4 py-2.5 rounded-2xl rounded-br-sm bg-gradient-to-r from-amber-400/20 via-amber-400/15 to-amber-500/10 border border-amber-400/30 text-white font-sans text-xs sm:text-sm leading-relaxed shadow-sm">
          {text}
        </div>
        {timestamp && (
          <span className="text-[10px] font-mono text-zinc-500 pr-1">
            {timestamp}
          </span>
        )}
      </div>

      <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 flex-shrink-0 mb-4">
        <User className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};
