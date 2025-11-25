import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Globe, Plus, Image as ImageIcon } from 'lucide-react';

interface InputAreaProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustHeight();
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="w-full mx-auto mb-2">
      {/* 
        Key Design change: 
        Matches the sleek, dark aesthetic of the second reference image.
        BUT with the Cyan/Blue colors of the first image.
        Uses bg-[#0f172a] (Slate 900) with a cyan border glow.
      */}
      <div className="bg-[#0f172a]/80 backdrop-blur-md rounded-[2rem] p-3 transition-all duration-300 border border-cyan-500/30 shadow-[0_0_15px_-3px_rgba(34,211,238,0.15)] focus-within:shadow-[0_0_20px_-3px_rgba(34,211,238,0.25)] focus-within:border-cyan-400/50 relative">
        
        {/* Input Field */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          rows={1}
          disabled={disabled}
          className="w-full bg-transparent text-slate-100 placeholder-slate-500 px-4 py-3 text-lg focus:outline-none resize-none no-scrollbar max-h-[200px]"
          style={{ minHeight: '56px' }}
        />

        {/* Toolbar Footer */}
        <div className="flex items-center justify-between px-2 pt-1 pb-1">
          
          {/* Left Actions */}
          <div className="flex items-center gap-1">
            <button className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-900/20 rounded-full transition-colors" title="Add Attachment">
              <Plus size={20} />
            </button>
            <button className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-900/20 rounded-full transition-colors hidden sm:block" title="Search Web">
              <Globe size={18} />
            </button>
            <button className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-900/20 rounded-full transition-colors hidden sm:block" title="Upload Image">
              <ImageIcon size={18} />
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
             <div className="text-xs text-slate-500 hidden md:block mr-2 font-medium">
               {input.length > 0 ? `${input.length} chars` : 'Gemini 2.5'}
             </div>
             
             {input.length === 0 ? (
                <button className="p-3 bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 rounded-full transition-colors">
                  <Mic size={20} />
                </button>
             ) : (
                <button 
                  onClick={handleSend}
                  disabled={disabled}
                  className={`p-3 rounded-full transition-all duration-200 flex items-center justify-center ${
                    disabled 
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                      : 'bg-cyan-500 text-white hover:bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                  }`}
                >
                  <Send size={18} className={disabled ? '' : 'ml-0.5'} />
                </button>
             )}
          </div>
        </div>
      </div>
      
      <div className="text-center mt-3 text-xs text-slate-600 font-medium">
        Gemini can make mistakes, so double-check it.
      </div>
    </div>
  );
};