import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Plus, MessageSquare, MoreHorizontal, Image, Mic, 
  Sparkles, History, Settings, Volume2, Copy, ThumbsUp, 
  ThumbsDown, RefreshCw, X, ChevronRight, Zap
} from 'lucide-react';

// --- COMPONENT: TIN NHẮN (MESSAGE BUBBLE) ---
const ChatMessage = ({ message }) => {
  const isAI = message.sender === 'ai';

  return (
    <div className={`group w-full text-slate-200 border-b border-black/5 ${isAI ? 'bg-transparent' : 'bg-transparent'}`}>
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
          {/* Sender Name */}
          <div className="font-bold text-sm mb-1 opacity-90">
             {isAI ? 'Sensei AI' : 'Bạn'}
          </div>

          {/* Text Body */}
          <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700 max-w-none text-[15px] text-slate-300">
             {message.text.split('\n').map((line, i) => (
                <p key={i} className="mb-2 last:mb-0">{line}</p>
             ))}
          </div>

          {/* AI Action Bar (Chỉ hiện khi hover hoặc trên mobile) */}
          {isAI && (
            <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
               <button className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-md transition-colors" title="Nghe phát âm">
                  <Volume2 size={16} />
               </button>
               <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors" title="Sao chép">
                  <Copy size={16} />
               </button>
               <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors" title="Tạo lại câu trả lời">
                  <RefreshCw size={16} />
               </button>
               <div className="h-4 w-[1px] bg-slate-700 mx-1"></div>
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
  const messagesEndRef = useRef(null);

  // Mock Conversations History
  const history = [
    { id: 1, title: 'Luyện tập Hiragana hàng A', date: 'Hôm nay' },
    { id: 2, title: 'Giải thích ngữ pháp wa/ga', date: 'Hôm qua' },
    { id: 3, title: 'Cách đếm số trong tiếng Nhật', date: '7 ngày trước' },
  ];

  // Mock Active Chat Messages
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'user', 
      text: 'Giải thích giúp mình sự khác nhau giữa "Konnichiwa" và "Konbanwa" với?' 
    },
    { 
      id: 2, 
      sender: 'ai', 
      text: 'Chào bạn! Đây là sự khác biệt cơ bản giữa hai câu chào này:\n\n1. **Konnichiwa (こんにちは):**\n- Nghĩa là: "Xin chào" hoặc "Chào buổi trưa/chiều".\n- Sử dụng: Thường dùng từ khoảng 10:00 sáng đến trước khi trời tối (khoảng 17:00 - 18:00).\n\n2. **Konbanwa (こんばんは):**\n- Nghĩa là: "Chào buổi tối".\n- Sử dụng: Dùng sau khi trời đã tối hẳn (sau 18:00).\n\n💡 **Mẹo nhỏ:** Bạn có thể nhớ "Konbanwa" dùng cho lúc "Ban đêm".' 
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: input }]);
    setInput('');
    // Simulate AI thinking...
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
        <div className="flex-1 overflow-y-auto custom-scrollbar-dark pb-32">
           {messages.length === 0 ? (
              // EMPTY STATE
              <div className="h-full flex flex-col items-center justify-center px-4">
                 <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/10 border border-slate-700">
                    <Sparkles size={40} className="text-emerald-500 animate-pulse"/>
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2">Sensei AI có thể giúp gì?</h2>
                 <p className="text-slate-400 text-center max-w-md mb-8">Tôi có thể giúp bạn luyện hội thoại, sửa lỗi ngữ pháp, hoặc giải thích văn hóa Nhật Bản.</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                    {[
                        { title: 'Luyện hội thoại', desc: 'Đóng vai nhân viên cửa hàng tiện lợi' },
                        { title: 'Kiểm tra ngữ pháp', desc: 'Sửa lỗi câu văn tiếng Nhật của tôi' },
                        { title: 'Giải thích từ vựng', desc: 'Sự khác nhau giữa Kore, Sore, Are' },
                        { title: 'Văn hóa', desc: 'Quy tắc ứng xử khi đi tàu điện' },
                    ].map((item, idx) => (
                        <button key={idx} className="text-left p-4 rounded-xl border border-slate-700 bg-slate-800/30 hover:bg-slate-800 hover:border-emerald-500/50 transition-all group">
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
                 <div ref={messagesEndRef} className="h-4"/>
              </div>
           )}
        </div>

        {/* Input Area (Fixed Bottom) */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#0F172A] via-[#0F172A] to-transparent">
           <div className="max-w-3xl mx-auto">
              {/* Suggestion Chips (Optional) */}
              {messages.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-1">
                      <button className="whitespace-nowrap px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                         Cách dùng khác?
                      </button>
                      <button className="whitespace-nowrap px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                         Cho ví dụ câu
                      </button>
                  </div>
              )}

              {/* Main Input Box */}
              <div className="relative bg-[#1E293B] rounded-2xl border border-slate-600 shadow-2xl focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500 transition-all">
                 <form onSubmit={handleSend} className="flex flex-col">
                    <textarea 
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       onKeyDown={(e) => {
                           if(e.key === 'Enter' && !e.shiftKey) {
                               e.preventDefault();
                               handleSend(e);
                           }
                       }}
                       placeholder="Nhắn tin cho Sensei..."
                       className="w-full bg-transparent text-slate-200 placeholder-slate-500 px-4 py-4 max-h-48 resize-none focus:outline-none text-[15px] leading-relaxed"
                       rows={1}
                       style={{ minHeight: '56px' }}
                    />
                    
                    {/* Toolbar */}
                    <div className="flex items-center justify-between px-2 pb-2">
                       <div className="flex items-center gap-1">
                          <button type="button" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Đính kèm ảnh">
                             <Plus size={20}/>
                          </button>
                          <button type="button" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Tìm trên web">
                             <Image size={20}/>
                          </button>
                          <button type="button" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Micro">
                             <Mic size={20}/>
                          </button>
                       </div>
                       
                       <button 
                          type="submit" 
                          disabled={!input.trim()}
                          className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center
                             ${input.trim() 
                               ? 'bg-emerald-600 text-white shadow-lg hover:bg-emerald-500' 
                               : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
                          `}
                       >
                          <Send size={18} />
                       </button>
                    </div>
                 </form>
              </div>
              <p className="text-center text-[10px] text-slate-500 mt-3 font-medium">Sensei AI có thể mắc lỗi. Hãy kiểm tra lại thông tin quan trọng.</p>
           </div>
        </div>

      </div>
    </div>
  );
}