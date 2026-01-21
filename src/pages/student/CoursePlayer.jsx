import React, { useState, useEffect, useRef } from 'react';
import { Play, CheckCircle2, Circle, MessageSquare, List, Send, Sparkles, ChevronLeft, MoreVertical, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CoursePlayer() {
  // const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState('curriculum'); 
  const [inputMsg, setInputMsg] = useState('');
  const chatEndRef = useRef(null); // Để auto scroll xuống cuối chat

  // Mock Data
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Konnichiwa! 👋 Mình là Sensei AI. \nMình có thể giải thích ngữ pháp, từ vựng hoặc tóm tắt video giúp bạn.' }
  ]);

  const lessons = [
    { id: 1, title: "1. Giới thiệu bảng chữ cái Hiragana", duration: "10:05", status: "completed" }, // status: completed, active, locked, pending
    { id: 2, title: "2. Hàng A, I, U, E, O", duration: "15:20", status: "active" },
    { id: 3, title: "3. Hàng Ka, Ki, Ku, Ke, Ko", duration: "12:45", status: "pending" },
    { id: 4, title: "4. Bài tập thực hành", duration: "05:00", status: "locked", isQuiz: true },
    { id: 5, title: "5. Hàng Sa, Shi, Su, Se, So", duration: "14:20", status: "locked" },
  ];

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTab]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if(!inputMsg.trim()) return;
    
    const newMsg = { id: Date.now(), sender: 'user', text: inputMsg };
    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');

    // Mock AI reply
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: 'Chức năng đang được phát triển, nhưng câu hỏi của bạn rất hay! (Demo Response)' 
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      
      {/* 1. TOP HEADER: Gọn gàng, Dark Mode nhẹ */}
      <header className="h-16 bg-slate-900 text-white flex items-center px-6 justify-between shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-4">
          <Link to="/student/courses" className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white">
             <ChevronLeft size={24} />
          </Link>
          <div>
             <p className="text-xs text-slate-300">Bài 2: Hàng A, I, U, E, O</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Progress Circular (Optional) or Bar */}
           <div className="flex flex-col items-end mr-2">
              <span className="text-xs text-slate-300 mb-1">Hoàn thành 15%</span>
              <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-[15%] h-full bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              </div>
           </div>
           {/* Avatar */}
           <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold ring-2 ring-slate-700">M</div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: VIDEO PLAYER AREA */}
        <div className="flex-1 bg-black relative flex flex-col justify-center group">
           {/* Gradient Background Effect for "Cinema Mode" feel */}
           <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-black/80 pointer-events-none"></div>
           
           {/* Placeholder Player */}
           <div className="w-full max-w-5xl mx-auto aspect-video bg-slate-900 rounded-lg shadow-2xl flex items-center justify-center relative overflow-hidden border border-slate-800">
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-blue-600 group-hover:scale-110 transition-all cursor-pointer shadow-lg">
                    <Play size={32} className="text-white fill-white ml-1" />
                 </div>
              </div>
              <p className="absolute bottom-10 text-slate-500 text-sm">Video Player Placeholder</p>
           </div>
        </div>

        {/* RIGHT: SIDEBAR (Tabs & Content) */}
        <div className="w-[400px] bg-white border-l border-slate-200 flex flex-col shadow-xl z-10">
          
          {/* Custom Tab Switcher */}
          <div className="flex p-2 bg-slate-50 border-b border-slate-200 gap-1">
            <button 
              onClick={() => setActiveTab('curriculum')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === 'curriculum' 
                  ? 'bg-white text-blue-600 shadow-sm border border-slate-200' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <List size={18} /> Bài học
            </button>
            <button 
               onClick={() => setActiveTab('ai-chat')}
               className={`flex-1 py-2.5 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
                 activeTab === 'ai-chat' 
                   ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                   : 'text-slate-500 hover:bg-slate-100'
               }`}
            >
              <Sparkles size={18} /> AI Sensei
            </button>
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            
            {/* TAB 1: CURRICULUM */}
            {activeTab === 'curriculum' && (
              <div className="py-2">
                 {lessons.map((lesson) => {
                   // Style logic
                   const isActive = lesson.status === 'active';
                   const isCompleted = lesson.status === 'completed';
                   const isLocked = lesson.status === 'locked';

                   return (
                     <div 
                        key={lesson.id} 
                        className={`group px-5 py-4 flex items-start gap-4 cursor-pointer transition-colors border-l-[3px] 
                        ${isActive 
                            ? 'bg-blue-50/50 border-blue-600' 
                            : 'border-transparent hover:bg-slate-50'
                        }
                        ${isLocked ? 'opacity-60 cursor-not-allowed' : ''}
                        `}
                     >
                        {/* Icon Status */}
                        <div className="mt-0.5 shrink-0">
                           {isCompleted && <CheckCircle2 size={20} className="text-green-500 fill-green-50" />}
                           {isActive && <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center"><div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div></div>}
                           {lesson.status === 'pending' && <Circle size={20} className="text-slate-300" />}
                           {isLocked && <Lock size={20} className="text-slate-300" />}
                        </div>

                        {/* Text Info */}
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium leading-snug ${isActive ? 'text-blue-700' : 'text-slate-700'}`}>
                             {lesson.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1.5">
                             {lesson.isQuiz 
                                ? <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded uppercase tracking-wider">Quiz</span> 
                                : <span className="text-xs text-slate-400 font-medium">{lesson.duration}</span>
                             }
                          </div>
                        </div>

                        {/* Hover Action */}
                        {!isLocked && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play size={16} className="text-slate-400" />
                            </div>
                        )}
                     </div>
                   );
                 })}
              </div>
            )}

            {/* TAB 2: AI CHAT */}
            {activeTab === 'ai-chat' && (
              <div className="flex flex-col h-full bg-slate-50/50">
                {/* Chat History */}
                <div className="flex-1 p-4 space-y-5 overflow-y-auto">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex max-w-[85%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                         
                         {/* Avatar for AI */}
                         {msg.sender === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-sm text-white">
                               <Sparkles size={14} />
                            </div>
                         )}

                         <div className={`p-3 rounded-2xl text-sm shadow-sm leading-relaxed whitespace-pre-line
                            ${msg.sender === 'user' 
                               ? 'bg-blue-600 text-white rounded-tr-none' 
                               : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                            }`}>
                            {msg.text}
                         </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                
                {/* Input Area - Floating style */}
                <div className="p-4 bg-white border-t border-slate-100">
                  <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                        <input 
                           type="text" 
                           value={inputMsg}
                           onChange={(e) => setInputMsg(e.target.value)}
                           placeholder="Hỏi gì đó..."
                           className="w-full pl-4 pr-10 py-3 bg-slate-100 border-transparent focus:bg-white border focus:border-blue-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all text-sm"
                        />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600">
                            <MessageSquare size={18} />
                        </button>
                    </div>
                    <button 
                        type="submit" 
                        disabled={!inputMsg.trim()}
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                    >
                      <Send size={18} />
                    </button>
                  </form>
                  <p className="text-[10px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
                      <Sparkles size={10} /> AI Support (Beta)
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}