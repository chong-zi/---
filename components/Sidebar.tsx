import React from 'react';
import { MessageSquare, Plus, History, LayoutGrid, Settings } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-[#020617]/95 backdrop-blur-md border-r border-cyan-500/10 transition-all duration-300 z-20 flex flex-col ${isOpen ? 'w-64' : 'w-0 overflow-hidden'}`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-slate-100">
           <LayoutGrid size={20} className="text-cyan-400" />
           <span>Cockpit</span>
        </div>
      </div>

      <div className="px-3 py-2">
        <button className="w-full flex items-center gap-2 bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/20 text-cyan-200 py-2.5 px-4 rounded-lg transition-colors text-sm font-medium">
          <Plus size={16} />
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1">
        <div className="text-xs font-medium text-slate-500 px-3 py-2 uppercase tracking-wider">Recent</div>
        {[1, 2, 3].map((i) => (
          <button key={i} className="w-full flex items-center gap-3 text-slate-400 hover:text-cyan-300 hover:bg-white/5 py-2 px-3 rounded-md transition-colors text-sm text-left truncate group">
            <MessageSquare size={16} className="shrink-0 group-hover:text-cyan-400" />
            <span className="truncate">Analysis of Q3 Performance Data...</span>
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-white/5 space-y-1">
         <button className="w-full flex items-center gap-3 text-slate-400 hover:text-cyan-300 hover:bg-white/5 py-2 px-3 rounded-md transition-colors text-sm">
            <History size={16} />
            <span>History</span>
          </button>
          <button className="w-full flex items-center gap-3 text-slate-400 hover:text-cyan-300 hover:bg-white/5 py-2 px-3 rounded-md transition-colors text-sm">
            <Settings size={16} />
            <span>Settings</span>
          </button>
      </div>
    </div>
  );
};