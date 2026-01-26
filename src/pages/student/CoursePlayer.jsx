import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, CheckCircle2, Circle, MessageSquare, List, Send, 
  Sparkles, ChevronLeft, Lock, Flame, Star, Trophy, Headphones, BookOpen 
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Component hiển thị thẻ bài học
const LessonCard = ({ lesson, isActive, onClick }) => {
  const isLocked = lesson.status === 'locked';
  const isCompleted = lesson.status === 'completed';

  return (
    <div 
      onClick={() => !isLocked && onClick(lesson)}
      className={`relative group flex items-center gap-4 p-4 mb-3 rounded-2xl transition-all duration-300 border-2 cursor-pointer
        ${isActive 
          ? 'bg-white border-emerald-500 shadow-[0_8px_30px_rgb(16,185,129,0.15)] scale-[1.02]' 
          : isLocked 
            ? 'bg-slate-50 border-slate-100 opacity-70 cursor-not-allowed' 
            : 'bg-white border-slate-100 hover:border-emerald-200 hover:shadow-md'
        }
      `}
    >
      {/* Icon trạng thái bên trái */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors
        ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 
          isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 animate-pulse-slow' : 
          isLocked ? 'bg-slate-200 text-slate-400' : 'bg-slate-100 text-slate-400'}
      `}>
        {isCompleted ? <CheckCircle2 size={24} /> : 
         isLocked ? <Lock size={20} /> : 
         isActive ? <Play size={20} fill="currentColor" /> : 
         <span className="font-bold text-lg">{lesson.id}</span>}
      </div>

      {/* Nội dung bài học */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {lesson.isQuiz ? (
            <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Trophy size={10} /> Quiz
            </span>
          ) : (
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <BookOpen size={10} /> Bài học
            </span>
          )}
          {isActive && <span className="text-[10px] font-bold text-emerald-600 animate-bounce">Đang học</span>}
        </div>
        <h4 className={`font-bold text-sm leading-tight ${isLocked ? 'text-slate-400' : 'text-slate-700'}`}>
          {lesson.title}
        </h4>
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
          {!isLocked && <Headphones size={12} />} {lesson.duration}
        </p>
      </div>

      {/* Hiệu ứng hover */}
      {!isLocked && !isActive && (
        <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500">
          <Play size={24} fill="currentColor" />
        </div>
      )}
    </div>
  );
};

export default function CoursePlayer() {
  const [activeTab, setActiveTab] = useState('curriculum'); 
  const [inputMsg, setInputMsg] = useState('');
  const chatEndRef = useRef(null);

  // Mock Data
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Konnichiwa! (Xin chào) 👋 \nMình là Sensei AI. Hôm nay chúng ta sẽ chinh phục hàng chữ "A-I-U-E-O" nhé!' }
  ]);

  const lessons = [
    { id: 1, title: 'Giới thiệu bảng chữ cái Hiragana', duration: '10:05', status: 'completed' },
    { id: 2, title: 'Hàng A, I, U, E, O - Cách phát âm chuẩn', duration: '15:20', status: 'active' },
    { id: 3, title: 'Hàng Ka, Ki, Ku, Ke, Ko - Luyện tập', duration: '12:45', status: 'pending' },
    { id: 4, title: 'Bài tập thực hành nghe hiểu', duration: '05:00', status: 'locked', isQuiz: true },
    { id: 5, title: 'Hàng Sa, Shi, Su, Se, So', duration: '14:20', status: 'locked' },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = { id: Date.now(), sender: 'user', text: inputMsg };
    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'Sugoi! (Tuyệt vời) 🌟 Câu hỏi rất hay. Trong tiếng Nhật, nguyên âm được phát âm ngắn và dứt khoát hơn tiếng Việt đó.',
        },
      ]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDFBF7] font-sans text-slate-800 selection:bg-emerald-100">
      
      {/* HEADER: Gamified Style */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between shrink-0 z-30 shadow-sm relative">
        <div className="flex items-center gap-4">
          <Link
            to="/student/courses"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 transition-all text-slate-400 border border-slate-200 hover:border-emerald-200"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h1 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              Tiếng Nhật Sơ Cấp 1 
              <span className="text-xs font-normal px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md">N5</span>
            </h1>
          </div>
        </div>

        {/* Stats / Gamification Area */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-1 text-orange-500 font-bold" title="Chuỗi ngày học">
            <Flame size={20} fill="currentColor" /> 
            <span>12</span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-yellow-500 font-bold" title="Điểm kinh nghiệm">
            <Star size={20} fill="currentColor" /> 
            <span>450 XP</span>
          </div>
          
          <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

          <div className="flex items-center gap-3">
             <div className="flex flex-col items-end mr-1">
               <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Tiến độ</span>
               <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                 <div className="w-[35%] h-full bg-emerald-500 rounded-full"></div>
               </div>
             </div>
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-9 h-9 rounded-full border-2 border-white shadow-md bg-slate-100" />
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Background Decorative Pattern (Optional subtle detail) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>

        {/* LEFT: VIDEO AREA */}
        <div className="flex-1 flex flex-col relative z-10 overflow-y-auto">
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full">
            
            {/* Video Wrapper styled like a Tablet/Screen */}
            <div className="bg-white p-2 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border-4 border-white ring-1 ring-slate-200/50">
              <div className="aspect-video bg-slate-900 rounded-[1.5rem] relative overflow-hidden group cursor-pointer">
                {/* Simulated Content */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                  <div className="text-center">
                     <span className="text-6xl mb-4 block animate-bounce">あ</span>
                     <p className="text-slate-400 text-sm font-medium tracking-widest uppercase">Hiragana Lesson 2</p>
                  </div>
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                   <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                     <Play size={32} fill="white" className="text-white ml-1" />
                   </div>
                </div>
              </div>
            </div>

            {/* Lesson Info below video */}
            <div className="mt-8 flex justify-between items-start px-2">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">2. Hàng A, I, U, E, O</h2>
                <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
                  Trong bài này, chúng ta sẽ học cách viết và phát âm 5 nguyên âm cơ bản nhất trong tiếng Nhật. 
                  Hãy chuẩn bị giấy bút để luyện viết nhé!
                </p>
              </div>
              <div className="flex gap-2">
                 <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 shadow-sm transition-all">
                   <BookOpen size={16} /> Tài liệu
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-sm hover:bg-emerald-200 transition-all">
                   Bài tiếp theo <ChevronLeft size={16} className="rotate-180" />
                 </button>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT: SIDEBAR (Floating Style) */}
        <div className="w-[400px] bg-white/80 backdrop-blur-xl border-l border-slate-200 flex flex-col z-20 shadow-[-5px_0_30px_rgba(0,0,0,0.02)]">
          
          {/* Custom Tab Switcher */}
          <div className="p-4 pb-2">
             <div className="bg-slate-100 p-1 rounded-xl flex font-bold text-sm relative">
                <button 
                  onClick={() => setActiveTab('curriculum')}
                  className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all z-10 ${activeTab === 'curriculum' ? 'text-slate-800 shadow-sm bg-white ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List size={16} /> Bài học
                </button>
                <button 
                  onClick={() => setActiveTab('ai-chat')}
                  className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all z-10 ${activeTab === 'ai-chat' ? 'text-indigo-600 shadow-sm bg-white ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Sparkles size={16} className={activeTab === 'ai-chat' ? 'text-indigo-500' : ''} /> AI Sensei
                </button>
             </div>
          </div>

          {/* SIDEBAR CONTENT AREA */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-2">
            
            {activeTab === 'curriculum' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between mb-4 mt-2">
                  <h3 className="font-bold text-slate-700">Nội dung khóa học</h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">15% Hoàn thành</span>
                </div>
                {lessons.map((lesson) => (
                  <LessonCard 
                    key={lesson.id} 
                    lesson={lesson} 
                    isActive={lesson.status === 'active'}
                    onClick={() => {}}
                  />
                ))}
              </div>
            )}

            {activeTab === 'ai-chat' && (
              <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Chat History */}
                <div className="flex-1 space-y-4 pb-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex max-w-[85%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {msg.sender === 'ai' && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-md text-white border-2 border-white mt-1">
                            <Sparkles size={14} />
                          </div>
                        )}
                        <div className={`p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed
                          ${msg.sender === 'user' 
                            ? 'bg-emerald-600 text-white rounded-tr-none' 
                            : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'}`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </div>
            )}
          </div>

          {/* FOOTER INPUT (Only for AI Chat) */}
          {activeTab === 'ai-chat' && (
            <div className="p-4 bg-white border-t border-slate-100 pb-6">
              <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Hỏi Sensei về ngữ pháp..."
                  className="w-full pl-4 pr-12 py-3.5 bg-slate-50 border-transparent focus:bg-white border focus:border-indigo-500 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-lg shadow-indigo-200"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}