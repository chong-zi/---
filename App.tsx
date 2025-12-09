import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { InputArea } from './components/InputArea';
import { MessageBubble } from './components/MessageBubble';
import { ArtifactPanel } from './components/ArtifactPanel';
import { Message, Attachment } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { Menu, X, MoreHorizontal } from 'lucide-react';

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Initialize with Mock History to demonstrate functionality immediately
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      role: 'user',
      content: 'Can you analyze the performance benchmarks for the new inference engine? I need to know the optimal concurrency settings.',
      timestamp: Date.now() - 100000,
    },
    {
      id: 'msg-2',
      role: 'model',
      content: 'I have analyzed the benchmark logs. \n\nThe system shows a classic trade-off between throughput and latency. Based on the data, the sweet spot appears to be around a concurrency of 5.',
      timestamp: Date.now() - 95000,
    },
    {
      id: 'msg-3',
      role: 'model',
      content: 'Here is the detailed visualization of the Speed vs Concurrency curve. You can see the intersection point at y=167.',
      timestamp: Date.now() - 90000,
      attachment: {
         id: 'chart-1',
         type: 'chart',
         title: 'Speed vs Concurrency Analysis',
         content: 'Mock Data',
         description: 'Intersection at y=167'
      }
    }
  ]);
  
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Split Pane State
  const [activeArtifact, setActiveArtifact] = useState<Attachment | null>(null);
  const [sidePanelWidth, setSidePanelWidth] = useState(500); // Default width in px
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeArtifact]); // Scroll when messages change or artifact panel opens/closes

  // Handle Dragging Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    // Calculate new width relative to the container's LEFT edge (Left Panel Mode)
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;
    
    // Clamp width constraints (min 300px, max 70% of screen to leave room for chat)
    const constrainedWidth = Math.max(300, Math.min(newWidth, containerRect.width * 0.7));
    setSidePanelWidth(constrainedWidth);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.classList.add('resizing');
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('resizing');
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('resizing');
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);


  /**
   * Handle sending a user message.
   * This function appends a user message to local state, shows a loading
   * indicator, and either simulates an artifact generation or calls the
   * Gemini service to produce a response.
   *
   * @param text - The user's input text
   */
  const handleSendMessage = async (text: string) => {
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);

    try {
      // Mocking special behavior for the "Visualize Data" specific prompt to demo the artifact
      if (text.includes("Visualize Data") || text.includes("visualization")) {
         // Simulate delay
         await new Promise(resolve => setTimeout(resolve, 1500));
         
         const mockArtifact: Attachment = {
             id: `chart-${Date.now()}`,
             type: 'chart',
             title: 'Speed vs Concurrency',
             content: 'Mock Data',
             description: 'Intersection at y=167'
         };

         const newBotMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            content: "I've generated a new analysis based on the latest parameters.",
            timestamp: Date.now(),
            attachment: mockArtifact
         };
         
         setMessages(prev => [...prev, newBotMessage]);
         setActiveArtifact(mockArtifact);
      } else {
          // Normal flow
          const responseText = await sendMessageToGemini(text, [...messages, newUserMessage]);
          
          const newBotMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            content: responseText,
            timestamp: Date.now(),
          };
          setMessages(prev => [...prev, newBotMessage]);
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617] text-slate-100`}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area Container */}
      <main 
        ref={containerRef}
        className={`flex-1 flex flex-row h-full relative transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        
        {/* 1. Left Panel: Artifact Details (If Active) */}
        {activeArtifact && (
            <div 
                className="flex-shrink-0 h-full bg-[#0f172a] shadow-xl relative z-20"
                style={{ width: sidePanelWidth }}
            >
                <ArtifactPanel 
                  artifact={activeArtifact} 
                  onClose={() => setActiveArtifact(null)} 
                />
            </div>
        )}

        {/* 2. Resizer Handle (If Active) */}
        {activeArtifact && (
          <div 
            className={`w-1 hover:w-1.5 bg-cyan-900/20 hover:bg-cyan-500/50 cursor-col-resize z-30 transition-all flex items-center justify-center group flex-shrink-0 ${isDragging ? 'bg-cyan-500/50 w-1.5' : ''}`}
            onMouseDown={handleMouseDown}
          >
             <div className="h-8 w-1 bg-slate-700 rounded-full group-hover:bg-cyan-400 transition-colors"></div>
          </div>
        )}
        
        {/* 3. Right Panel: Chat Area (Flex 1 to take remaining space) */}
        <div className="flex-1 flex flex-col h-full min-w-0 relative">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-4 md:px-8 z-10 bg-gradient-to-b from-[#020617] via-[#020617]/80 to-transparent pointer-events-none">
              <div className="flex items-center gap-3 pointer-events-auto">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
              
              <button className="pointer-events-auto p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors">
                 <MoreHorizontal size={20} />
              </button>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto no-scrollbar pt-20 pb-4">
              <div className="max-w-5xl mx-auto px-4 md:px-8 w-full h-full flex flex-col">
                {messages.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)]"></div>
                    <h1 className="text-2xl md:text-3xl font-medium text-slate-100 mb-2">How can I help you today?</h1>
                    <p className="text-slate-400 max-w-md">I can help you analyze data, write code, or just chat.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-10 w-full max-w-3xl">
                        <button onClick={() => handleSendMessage("Visualize Data: Speed vs Concurrency")} className="p-4 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-cyan-500/20 hover:border-cyan-400 text-left transition-all group backdrop-blur-sm">
                            <div className="text-cyan-100 font-medium mb-1 text-sm group-hover:text-cyan-300">Visualize Data</div>
                            <div className="text-slate-500 text-xs group-hover:text-slate-400">Plot Speed vs Concurrency curves</div>
                        </button>
                        <button onClick={() => handleSendMessage("Analyze the logs for error spikes in the last hour.")} className="p-4 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-cyan-500/20 hover:border-cyan-400 text-left transition-all group backdrop-blur-sm">
                            <div className="text-cyan-100 font-medium mb-1 text-sm group-hover:text-cyan-300">Analyze Logs</div>
                            <div className="text-slate-500 text-xs group-hover:text-slate-400">Find anomalies in system performance</div>
                        </button>
                        <button onClick={() => handleSendMessage("Explain the concept of 'Token Bucket' algorithm.")} className="p-4 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-cyan-500/20 hover:border-cyan-400 text-left transition-all group backdrop-blur-sm">
                            <div className="text-cyan-100 font-medium mb-1 text-sm group-hover:text-cyan-300">Explain Concepts</div>
                            <div className="text-slate-500 text-xs group-hover:text-slate-400">Technical definitions and examples</div>
                        </button>
                         <button onClick={() => handleSendMessage("Draft a status report for the engineering team.")} className="p-4 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 border border-cyan-500/20 hover:border-cyan-400 text-left transition-all group backdrop-blur-sm">
                             <div className="text-cyan-100 font-medium mb-1 text-sm group-hover:text-cyan-300">Write Content</div>
                             <div className="text-slate-500 text-xs group-hover:text-slate-400">Draft emails, reports, and more</div>
                        </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col pb-4">
                    {messages.map((msg) => (
                      <MessageBubble 
                        key={msg.id} 
                        message={msg} 
                        onArtifactClick={(attachment) => setActiveArtifact(attachment)}
                      />
                    ))}
                    {loading && (
                        <div className="flex gap-4 py-6 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center">
                                <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
                            </div>
                            <div className="space-y-2">
                                 <div className="h-4 bg-slate-800 rounded w-24"></div>
                                 <div className="h-4 bg-slate-800 rounded w-64"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 md:px-8 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent z-10">
               <div className="max-w-5xl mx-auto w-full">
                   <InputArea onSend={handleSendMessage} disabled={loading} />
               </div>
            </div>
        </div>

      </main>
    </div>
  );
};

export default App;