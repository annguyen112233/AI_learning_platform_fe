import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Plus, MessageSquare, MoreHorizontal, Image, Mic, 
  Sparkles, History, Settings, Volume2, Copy, ThumbsUp, 
  ThumbsDown, RefreshCw, X, ChevronRight, Zap, Bot, Loader2
} from 'lucide-react';
import { askSenseiAI } from '@/services/chatService';

// --- COMPONENT: RENDER TEXT VỚI MARKDOWN ĐƠN GIẢN ---
const renderText = (text) => {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-slate-700 px-1.5 py-0.5 rounded text-emerald-300 text-sm font-mono">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

// --- COMPONENT: TIN NHẮN (MESSAGE BUBBLE) ---
const ChatMessage = ({ message }) => {
  const isAI = message.sender === 'ai';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`group w-full text-slate-200 border-b border-black/5`}>
      <div className="max-w-3xl mx-auto px-4 py-8 flex gap-6">
        
        {/* Avatar */}
        <div className="shrink-0 flex flex-col relative items-end">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm 
            ${isAI 
              ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(5,150,105,0.4)]' 
              : 'bg-slate-700 text-slate-300'}
          `}>
            {isAI ? <Sparkles size={16} /> : <span className="text-xs font-bold">You</span>}
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-hidden">
          <div className="font-bold text-sm mb-1 opacity-90">
             {isAI ? 'Sensei AI' : 'Bạn'}
          </div>

          {/* Text Body - Render markdown đơn giản */}
          <div className="prose prose-invert prose-p:leading-relaxed max-w-none text-[15px] text-slate-300">
             {message.text.split('\n').map((line, i) => (
                <p key={i} className="mb-2 last:mb-0">{renderText(line)}</p>
             ))}
          </div>

          {/* AI Action Bar */}
          {isAI && (
            <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
               <button onClick={handleCopy} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors" title="Sao chép">
                  {copied ? <span className="text-emerald-400 text-xs font-bold">✓</span> : <Copy size={16} />}
               </button>
               <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                  <ThumbsUp size={16} />
               </button>
               <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                  <ThumbsDown size={16} />
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function AIChatPage() {
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Chat history sidebar (local)
  const [history, setHistory] = useState([
    { id: 1, title: 'Giải thích ngữ pháp wa/ga' },
    { id: 2, title: 'Cách đếm số trong tiếng Nhật' },
  ]);

  const [messages, setMessages] = useState([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + 'px';
    }
  }, [input]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    // Thêm user message
    const userMsg = { id: Date.now(), sender: 'user', text: question };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Cập nhật history sidebar
    if (messages.length === 0) {
      setHistory(prev => [{ id: Date.now(), title: question.slice(0, 40) }, ...prev]);
    }

    try {
      const res = await askSenseiAI(question);
      const answer = res.data?.data?.answer || 'Sensei AI không trả lời được câu hỏi này.';
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: answer }]);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Xin lỗi, Sensei AI đang gặp sự cố. Thử lại sau nhé! 🙏';
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: errMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggest = (text) => {
    setInput(text);
    textareaRef.current?.focus();
  };


  return (
    <div className="flex h-screen bg-[#0F172A] text-slate-200 font-sans overflow-hidden">
      
      {/* === SIDEBAR (HISTORY) === */}
      <div className={`${sidebarOpen ? 'w-[280px]' : 'w-0'} bg-[#162032] border-r border-slate-700/50 flex flex-col transition-all duration-300 ease-in-out overflow-hidden relative shrink-0`}>
         
         {/* New Chat Button */}
         <div className="p-4">
            <button className="flex items-center gap-3 w-full px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg text-sm font-medium transition-all text-white shadow-sm group">
               <Plus size={18} className="group-hover:rotate-90 transition-transform"/> 
               <span>Cuộc hội thoại mới</span>
            </button>
         </div>

         {/* History List */}
         <div className="flex-1 overflow-y-auto px-2 pb-4 custom-scrollbar-dark">
            <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Gần đây</div>
            <div className="space-y-1">
               {history.map(item => (
                 <button key={item.id} className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-800/80 text-sm text-slate-300 hover:text-white transition-colors truncate flex items-center gap-3 group">
                    <MessageSquare size={16} className="text-slate-500 group-hover:text-emerald-400 transition-colors"/>
                    <span className="truncate flex-1">{item.title}</span>
                 </button>
               ))}
            </div>
         </div>

         {/* Sidebar Footer */}
         <div className="p-4 border-t border-slate-700/50">
             <button className="flex items-center gap-3 px-2 py-2 w-full text-sm text-slate-400 hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-full bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Zap size={16} fill="currentColor"/>
                </div>
                <div className="text-left flex-1">
                    <div className="font-bold text-xs text-emerald-400">Nâng cấp Pro</div>
                    <div className="text-[10px]">Mở khóa GPT-4</div>
                </div>
             </button>
         </div>
      </div>

      {/* === MAIN CHAT AREA === */}
      <div className="flex-1 flex flex-col relative h-full">
        
        {/* Header (Floating) */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-slate-700/50 bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-10">
           <div className="flex items-center gap-3">
              {!sidebarOpen && (
                 <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                    <ChevronRight size={20}/>
                 </button>
              )}
              {sidebarOpen && (
                  <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                    <X size={20}/>
                  </button>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-colors">
                 <span className="text-sm font-bold text-slate-200">Sensei AI 3.5</span>
                 <ChevronRight size={14} className="rotate-90 text-slate-500"/>
              </div>
           </div>
           <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <Settings size={20}/>
           </button>
        </header>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar-dark pb-36">
           {messages.length === 0 ? (
              // EMPTY STATE
              <div className="h-full flex flex-col items-center justify-center px-4">
                 <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/10 border border-slate-700">
                    <Sparkles size={40} className="text-emerald-500 animate-pulse"/>
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2">Sensei AI có thể giúp gì?</h2>
                 <p className="text-slate-400 text-center max-w-md mb-8">Tôi trả lời dựa trên nội dung khóa học bạn đang học. Hãy hỏi về từ vựng, ngữ pháp, văn hóa Nhật Bản!</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                    {[
                        { title: '📖 Giải thích từ vựng', desc: 'Sự khác nhau giữa は và が', action: 'Giải thích sự khác nhau giữa は (wa) và が (ga) trong tiếng Nhật' },
                        { title: '✍️ Kiểm tra ngữ pháp', desc: 'Sửa câu tiếng Nhật của tôi', action: 'Hãy giải thích cách dùng て form trong tiếng Nhật và cho ví dụ' },
                        { title: '🎌 Văn hóa Nhật Bản', desc: 'Quy tắc xã giao khi đi làm', action: 'Giải thích về keigo (kính ngữ) trong tiếng Nhật và khi nào nên dùng' },
                        { title: '📝 Hỏi về bài học', desc: 'Nội dung trong khóa học của tôi', action: 'Tóm tắt những gì tôi đã học trong khóa học của mình' },
                    ].map((item, idx) => (
                        <button key={idx} onClick={() => handleSuggest(item.action)} className="text-left p-4 rounded-xl border border-slate-700 bg-slate-800/30 hover:bg-slate-800 hover:border-emerald-500/50 transition-all group">
                            <div className="font-bold text-sm text-slate-200 group-hover:text-emerald-400 mb-1">{item.title}</div>
                            <div className="text-xs text-slate-500">{item.desc}</div>
                        </button>
                    ))}
                 </div>
              </div>
           ) : (
              // MESSAGE LIST
              <div className="flex flex-col pt-4">
                 {messages.map(msg => (
                    <ChatMessage key={msg.id} message={msg} />
                 ))}

                 {/* Typing Indicator */}
                 {isLoading && (
                   <div className="w-full border-b border-black/5">
                     <div className="max-w-3xl mx-auto px-4 py-8 flex gap-6">
                       <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(5,150,105,0.4)] shrink-0">
                         <Sparkles size={16} className="text-white" />
                       </div>
                       <div className="flex-1">
                         <div className="font-bold text-sm mb-3 opacity-90">Sensei AI</div>
                         <div className="flex items-center gap-1.5">
                           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                           <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                         </div>
                       </div>
                     </div>
                   </div>
                 )}
                 <div ref={messagesEndRef} className="h-4"/>
              </div>
           )}
        </div>

        {/* Input Area (Fixed Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#0F172A] via-[#0F172A] to-transparent">
           <div className="max-w-3xl mx-auto">
              {/* Quick Suggestion Chips */}
              {messages.length > 0 && !isLoading && (
                  <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-1">
                      {['Cho ví dụ câu', 'Giải thích thêm', 'Cách dùng khác?', 'Cho bài tập'].map(chip => (
                        <button key={chip} onClick={() => handleSuggest(chip)}
                          className="whitespace-nowrap px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                          {chip}
                        </button>
                      ))}
                  </div>
              )}

              {/* Main Input Box */}
              <div className="relative bg-[#1E293B] rounded-2xl border border-slate-600 shadow-2xl focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500 transition-all">
                 <form onSubmit={handleSend} className="flex flex-col">
                    <textarea 
                       ref={textareaRef}
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       onKeyDown={(e) => {
                           if(e.key === 'Enter' && !e.shiftKey) {
                               e.preventDefault();
                               handleSend(e);
                           }
                       }}
                       placeholder={isLoading ? 'Sensei AI đang suy nghĩ...' : 'Nhắn tin cho Sensei...'}
                       disabled={isLoading}
                       className="w-full bg-transparent text-slate-200 placeholder-slate-500 px-4 py-4 max-h-48 resize-none focus:outline-none text-[15px] leading-relaxed disabled:opacity-50"
                       rows={1}
                       style={{ minHeight: '56px' }}
                    />
                    
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-2 pb-2">
                       <div className="flex items-center gap-1">
                          <button type="button" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                             <Plus size={20}/>
                          </button>
                          <button type="button" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                             <Image size={20}/>
                          </button>
                          <button type="button" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                             <Mic size={20}/>
                          </button>
                       </div>
                       
                       <button 
                          type="submit" 
                          disabled={!input.trim() || isLoading}
                          className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center
                             ${(input.trim() && !isLoading)
                               ? 'bg-emerald-600 text-white shadow-lg hover:bg-emerald-500' 
                               : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
                          `}
                       >
                          {isLoading 
                            ? <Loader2 size={18} className="animate-spin" />
                            : <Send size={18} />}
                       </button>
                    </div>
                 </form>
              </div>
              <p className="text-center text-[10px] text-slate-500 mt-3 font-medium">Sensei AI trả lời dựa trên nội dung khóa học của bạn. Có thể mắc lỗi.</p>
           </div>
        </div>

      </div>
    </div>
  );
}