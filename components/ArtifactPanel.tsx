import React from 'react';
import { Download, Maximize2, X, MoreHorizontal } from 'lucide-react';
import { Attachment } from '../types';

interface ArtifactPanelProps {
  artifact: Attachment;
  onClose: () => void;
}

export const ArtifactPanel: React.FC<ArtifactPanelProps> = ({ artifact, onClose }) => {
  return (
    <div className="h-full flex flex-col bg-[#0f172a] border-r border-cyan-500/10 relative shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-cyan-500/10 bg-[#0f172a]/95 backdrop-blur">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-cyan-500 font-bold text-lg">li</span>
          <h3 className="text-slate-200 font-medium truncate">{artifact.title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-colors" title="Download">
            <Download size={18} />
          </button>
          <button className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-white/5 rounded-lg transition-colors" title="Expand">
            <Maximize2 size={18} />
          </button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors" title="Close">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#0B101E]">
        <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-slate-400">Intersection at y=167 and Region where x*y≈4000</div>
            </div>
            
            {/* Chart Area Container - Mocking the visual from screenshot */}
            <div className="w-full bg-white p-4 rounded-lg shadow-lg overflow-hidden relative">
                {/* 
                  Since we don't have a real charting library connected, we render a placeholder 
                  that mimics the "Speed vs Concurrency" chart image. 
                */}
                <div className="aspect-[4/3] w-full relative">
                    <img 
                        src="https://www.mermaidchart.com/img/disp/mermaid-chart-placeholder.png" 
                        alt="Chart Visualization" 
                        className="w-full h-full object-contain opacity-0 absolute"
                    />
                    {/* SVG Construction of the mock chart for better fidelity */}
                    <svg viewBox="0 0 500 300" className="w-full h-full font-sans text-[10px]">
                         {/* Grid */}
                         <defs>
                             <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                                 <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                             </pattern>
                         </defs>
                         <rect width="100%" height="100%" fill="white" />
                         <rect width="100%" height="100%" fill="url(#grid)" />

                         {/* Axes */}
                         <line x1="40" y1="260" x2="480" y2="260" stroke="#64748b" strokeWidth="1" />
                         <line x1="40" y1="260" x2="40" y2="20" stroke="#64748b" strokeWidth="1" />
                         
                         {/* Labels */}
                         <text x="250" y="290" textAnchor="middle" fill="#475569" fontSize="12">Concurrency</text>
                         <text x="15" y="150" textAnchor="middle" transform="rotate(-90, 15, 150)" fill="#475569" fontSize="12">Speed (tokens/sec)</text>

                         {/* Yellow Highlight Zone */}
                         <rect x="130" y="20" width="20" height="240" fill="#fef08a" opacity="0.5" />
                         
                         {/* Curve */}
                         <path d="M 50 60 Q 80 200 480 250" fill="none" stroke="#eab308" strokeWidth="2" />
                         <circle cx="50" cy="60" r="3" fill="#eab308" />
                         <circle cx="80" cy="140" r="3" fill="#eab308" />
                         <circle cx="140" cy="200" r="3" fill="#eab308" />
                         <circle cx="480" cy="250" r="3" fill="#eab308" />

                         {/* Dashed Lines */}
                         <line x1="40" y1="100" x2="480" y2="100" stroke="#eab308" strokeWidth="1" strokeDasharray="4 4" />
                         <line x1="60" y1="20" x2="60" y2="260" stroke="#eab308" strokeWidth="1" strokeDasharray="4 4" />

                         {/* Annotations */}
                         <text x="65" y="90" fill="red" fontSize="10">(4.97, 167)</text>
                         <text x="140" y="190" fill="#d97706" fontSize="10">x*y≈4000</text>
                         
                         {/* Title inside chart */}
                         <text x="250" y="30" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#334155">Speed vs Concurrency</text>
                    </svg>
                </div>
            </div>
            <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                    <div className="mt-1 w-5 h-5 rounded bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                        ✓
                    </div>
                    <div>
                        <h4 className="text-slate-200 font-medium mb-1">1. Speed Curve (Speed = 1/TPOT)</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            The vertical axis represents Token Output Speed (token/sec). The horizontal axis is concurrency. As concurrency increases, the single request output speed decreases, forming a typical downward curve.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                     <div className="mt-1 w-5 h-5 rounded bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                        ✓
                    </div>
                    <div>
                        <h4 className="text-slate-200 font-medium mb-1">2. Intersection at y=167</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                           Results:<br/>
                           • Intersection (x ≈ 4.97, y = 167)<br/>
                           • Meaning: When concurrency reaches ≈5, the token generation speed drops exactly to 167 tok/s.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};