import React from 'react';
import { Message, Attachment } from '../types';
import { Bot, User, Copy, ThumbsUp, ThumbsDown, BarChart2, ArrowRight } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MessageBubbleProps {
  message: Message;
  onArtifactClick?: (attachment: Attachment) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onArtifactClick }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`w-full flex gap-4 py-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User size={16} />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-cyan-950/50 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_10px_-2px_rgba(34,211,238,0.3)]">
            <Bot size={16} />
          </div>
        )}
      </div>

      <div className={`flex-1 min-w-0 space-y-2 flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-center gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="font-medium text-sm text-slate-200">
            {isUser ? 'You' : 'Gemini'}
          </span>
          <span className="text-xs text-slate-500">
             {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className={`text-slate-300 max-w-full ${isUser ? 'text-right' : 'text-left'}`}>
            {isUser ? (
                <p className="whitespace-pre-wrap leading-relaxed text-base text-slate-200">{message.content}</p>
            ) : (
                <div className="space-y-4">
                  {message.content && <MarkdownRenderer content={message.content} />}
                  
                  {/* Artifact / Chart Preview Card */}
                  {message.attachment && (
                    <div 
                      onClick={() => onArtifactClick?.(message.attachment!)}
                      className="mt-3 group cursor-pointer inline-flex flex-col gap-0 bg-[#1e293b]/50 hover:bg-[#1e293b] border border-cyan-500/20 hover:border-cyan-400/50 rounded-xl overflow-hidden transition-all duration-300 w-full max-w-md shadow-lg"
                    >
                      {/* Preview Image/Area */}
                      <div className="h-32 bg-slate-900/50 relative overflow-hidden border-b border-white/5">
                         {/* Abstract Chart Background */}
                         <svg className="absolute bottom-0 left-0 w-full h-full opacity-30 group-hover:opacity-50 transition-opacity" viewBox="0 0 100 40" preserveAspectRatio="none">
                           <path d="M0 40 L10 35 L20 38 L30 20 L40 25 L50 15 L60 18 L70 10 L80 12 L90 5 L100 8 V40 H0 Z" fill="url(#gradient-chart)" />
                           <defs>
                             <linearGradient id="gradient-chart" x1="0" x2="0" y1="0" y2="1">
                               <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                               <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                             </linearGradient>
                           </defs>
                           <path d="M0 40 L10 35 L20 38 L30 20 L40 25 L50 15 L60 18 L70 10 L80 12 L90 5 L100 8" fill="none" stroke="#22d3ee" strokeWidth="0.5" />
                         </svg>
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-slate-900/80 p-2 rounded-full border border-cyan-500/30 text-cyan-400 group-hover:scale-110 transition-transform">
                              <BarChart2 size={24} />
                            </div>
                         </div>
                      </div>

                      {/* Card Footer/Details */}
                      <div className="p-3 flex items-center justify-between">
                         <div className="flex flex-col">
                           <span className="text-sm font-medium text-cyan-100 group-hover:text-white transition-colors">
                             {message.attachment.title}
                           </span>
                           <span className="text-xs text-slate-400">
                             Click to view details
                           </span>
                         </div>
                         <ArrowRight size={16} className="text-slate-500 group-hover:text-cyan-400 -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </div>
                  )}
                </div>
            )}
        </div>

        {!isUser && (
          <div className="flex items-center gap-2 pt-2">
            <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-500 hover:text-cyan-300 transition-colors">
              <Copy size={14} />
            </button>
            <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-500 hover:text-cyan-300 transition-colors">
              <ThumbsUp size={14} />
            </button>
            <button className="p-1.5 rounded-md hover:bg-white/5 text-slate-500 hover:text-cyan-300 transition-colors">
              <ThumbsDown size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};