import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Lock, 
  MessageSquare, 
  List, 
  Send, 
  Sparkles, 
  ChevronLeft, 
  Flame, 
  Star, 
  Trophy, 
  Headphones, 
  BookOpen,
  FileText,
  Download,
  MoreVertical,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';

// --- COMPONENT: THẺ BÀI HỌC NHỎ GỌN (COMPACT LESSON CARD) ---
const LessonCard = ({ lesson, isActive, onClick }) => {
  const isLocked = lesson.status === 'locked';
  const isCompleted = lesson.status === 'completed';

  return (
    <div 
      onClick={() => !isLocked && onClick(lesson)}
      className={`relative group flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 border cursor-pointer select-none
        ${isActive 
          ? 'bg-emerald-50/80 border-emerald-200 shadow-sm ring-1 ring-emerald-100' 
          : isLocked 
            ? 'bg-slate-50/50 border-transparent opacity-50 cursor-not-allowed grayscale' 
            : 'bg-white border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 hover:shadow-sm'
        }
      `}
    >
      {/* 1. Icon trạng thái */}
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors relative overflow-hidden
        ${isCompleted ? 'bg-emerald-100 text-emerald-600' : 
          isActive ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md animate-pulse-slow' : 
          isLocked ? 'bg-slate-200 text-slate-400' : 'bg-slate-100 text-slate-500 group-hover:text-emerald-600 group-hover:bg-emerald-100'}
      `}>
        {isCompleted ? <CheckCircle2 size={18} strokeWidth={2.5} /> : 
         isLocked ? <Lock size={16} /> : 
         isActive ? <Play size={16} fill="currentColor" /> : 
         <span className="font-bold text-xs">{lesson.id}</span>}
         
         {/* Active indicator line */}
         {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600"></div>}
      </div>

      {/* 2. Thông tin bài học */}
      <div className="flex-1 min-w-0 py-0.5">
        <h4 className={`font-medium text-[13px] leading-tight truncate mb-1 ${isActive ? 'text-emerald-900 font-bold' : 'text-slate-700'}`}>
            {lesson.title}
        </h4>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
           {lesson.isQuiz ? (
            <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
              <Trophy size={10} /> Quiz
            </span>
           ) : (
             <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded-md">
               <Play size={10} /> {lesson.duration}
             </span>
           )}
           {isActive && <span className="text-emerald-600 font-bold">• Đang học</span>}
        </div>
      </div>

      {/* 3. Hover Play Icon */}
      {!isLocked && !isActive && !isCompleted && (
        <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm text-emerald-600 scale-90 group-hover:scale-100">
            <Play size={14} fill="currentColor" />
        </div>
      )}
    </div>
  );
};

// --- MAIN LAYOUT: PRO LEARNING FLOW ---
export default function CoursePlayer() {
  const [activeTab, setActiveTab] = useState('curriculum'); 
  const [inputMsg, setInputMsg] = useState('');
  const chatEndRef = useRef(null);
  const [currentLessonId, setCurrentLessonId] = useState(2); // Fake state

  // Mock Data
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Konnichiwa! (Xin chào) 👋 \nMình là Sensei AI. Bạn có thắc mắc gì về cách phát âm hàng "A-I-U-E-O" không?' }
  ]);

  const lessons = [
    { id: 1, title: 'Giới thiệu bảng chữ cái Hiragana', duration: '10:05', status: 'completed' },
    { id: 2, title: 'Hàng A, I, U, E, O - Cách phát âm chuẩn', duration: '15:20', status: 'active' },
    { id: 3, title: 'Hàng Ka, Ki, Ku, Ke, Ko - Luyện tập', duration: '12:45', status: 'pending' },
    { id: 4, title: 'Bài tập thực hành nghe hiểu', duration: '05:00', status: 'locked', isQuiz: true },
    { id: 5, title: 'Hàng Sa, Shi, Su, Se, So', duration: '14:20', status: 'locked' },
    { id: 6, title: 'Tổng ôn tập tuần 1 (Kiểm tra)', duration: '20:00', status: 'locked', isQuiz: true },
  ];

  // Auto scroll chat
  useEffect(() => {
    if (activeTab === 'ai-chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const newMsg = { id: Date.now(), sender: 'user', text: inputMsg };
    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'ai', text: 'Sugoi! (Tuyệt vời) 🌟 Nguyên âm "U" (う) trong tiếng Nhật môi sẽ dẹt hơn tiếng Việt nhé.' }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden">
      
      {/* ================= HEADER: PRO & GAMIFIED ================= */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center px-4 md:px-6 justify-between shrink-0 z-40 relative fixed top-0 left-0 right-0">
        
        {/* Left: Back & Title */}
        <div className="flex items-center gap-4 flex-1 truncate">
          <Link to="/student/courses" className="group flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 text-slate-500 transition-all">
            <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform"/>
          </Link>
          <div className="hidden md:block w-[1px] h-8 bg-slate-200/80 mx-2"></div>
          <div className="flex flex-col truncate">
            <h2 className="font-bold text-slate-800 text-sm md:text-base truncate">Tiếng Nhật Sơ Cấp 1: Bảng chữ cái Hiragana</h2>
            <span className="text-xs text-slate-500 font-medium hidden md:inline-block">Chương 1: Làm quen cơ bản</span>
          </div>
        </div>

        {/* Right: Gamification & Profile */}
        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          {/* Streak Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-orange-50/50 text-orange-600 rounded-full text-sm font-bold border border-orange-100/50 ring-1 ring-orange-50 shadow-sm" title="Chuỗi ngày học liên tiếp">
            <Flame size={18} fill="currentColor" className="animate-pulse-slow" /> 
            <span>12 Ngày</span>
          </div>
          
          {/* Progress & Avatar */}
          <div className="flex items-center gap-4 pl-4 border-l border-slate-200/80">
             <div className="hidden md:flex flex-col items-end">
               <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
                  <span>Tiến độ</span> <span className="bg-emerald-100 px-1.5 rounded text-[10px]">35%</span>
               </div>
               <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden ring-1 ring-slate-200/50">
                 <div className="w-[35%] h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
               </div>
             </div>
             <div className="relative group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-emerald-100 border-[3px] border-white shadow-sm overflow-hidden ring-2 ring-emerald-500/20 group-hover:ring-emerald-500 transition-all">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
             </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT (SPLIT VIEW) ================= */}
      <div className="flex-1 flex overflow-hidden pt-16"> {/* pt-16 for fixed header */}
        
        {/* ----- LEFT: THE LEARNING STAGE (VIDEO & CONTENT) ----- */}
        <div className="flex-1 flex flex-col overflow-y-auto scroll-smooth bg-slate-50/30 relative">
           {/* Subtle background pattern */}
           <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

           <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-6 lg:p-8 z-10">
              
              {/* CINEMATIC VIDEO PLAYER */}
              <div className="aspect-video bg-slate-900 rounded-2xl shadow-2xl shadow-slate-200/40 overflow-hidden relative group ring-1 ring-black/5">
                 {/* Fake Video Content */}
                 <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex items-center justify-center">
                    <div className="text-center opacity-90">
                       <span className="text-9xl text-white/90 font-thin tracking-widest block mb-6 drop-shadow-lg">あ</span>
                    </div>
                    {/* Watermark/Logo */}
                    <div className="absolute top-6 left-6 flex items-center gap-2 text-white/50 font-bold uppercase tracking-widest text-sm">
                        <Sparkles size={16} /> NihongoPro
                    </div>
                 </div>

                 {/* Big Play Overlay */}
                 <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-all cursor-pointer backdrop-blur-[1px]">
                    <div className="w-24 h-24 bg-emerald-500/90 hover:bg-emerald-400/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all group-hover:shadow-[0_0_60px_rgba(16,185,129,0.5)]">
                       <Play size={40} fill="white" className="text-white ml-2" />
                    </div>
                 </div>
                 
                 {/* Fake Controls Bar */}
                 <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent flex items-end px-4 pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-full flex items-center gap-4 text-white">
                        <Play size={20} fill="white"/>
                        <div className="flex-1 h-1.5 bg-white/30 rounded-full relative cursor-pointer group/progress">
                            <div className="w-1/3 h-full bg-emerald-500 rounded-full relative">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow scale-0 group-hover/progress:scale-100 transition-transform"></div>
                            </div>
                        </div>
                        <span className="text-xs font-medium">05:20 / 15:20</span>
                    </div>
                 </div>
              </div>

              {/* LESSON TITLE & ACTIONS */}
              <div className="mt-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
                 <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                       <h2 className="text-3xl font-bold text-slate-800">2. Hàng A, I, U, E, O - Cách phát âm chuẩn</h2>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 font-medium mb-4">
                        <span className="flex items-center gap-1.5"><img src="https://api.dicebear.com/7.x/initials/svg?seed=Sensei" className="w-5 h-5 rounded-full" alt=""/> Sensei Yuki</span>
                        <span>•</span>
                        <span>Cập nhật tháng 5, 2024</span>
                    </div>
                 </div>

                 {/* Primary Actions */}
                 <div className="flex gap-3 shrink-0">
                    <button className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm" title="Lưu bài học">
                        <Star size={20} />
                    </button>
                    <button className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm" title="Chia sẻ">
                        <Share2 size={20} />
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold hover:shadow-lg hover:shadow-emerald-200/50 transition-all hover:-translate-y-0.5">
                       Bài tiếp theo <ChevronLeft size={20} className="rotate-180" />
                    </button>
                 </div>
              </div>

              {/* TABBED DESCRIPTION / NOTES */}
              <div className="mt-10">
                 <div className="border-b border-slate-200 flex gap-8 mb-6">
                     <button className="pb-4 text-emerald-600 font-bold border-b-2 border-emerald-500 relative top-[1px]">Mô tả bài học</button>
                     <button className="pb-4 text-slate-500 font-medium hover:text-slate-800 transition-colors">Tài liệu đính kèm (2)</button>
                     <button className="pb-4 text-slate-500 font-medium hover:text-slate-800 transition-colors">Bình luận (14)</button>
                 </div>
                 
                 <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm prose prose-slate max-w-none prose-headings:text-slate-800 prose-a:text-emerald-600 hover:prose-a:text-emerald-700 prose-strong:text-slate-900">
                    <h3 className="text-xl">Tóm tắt nội dung</h3>
                    <p>Trong bài này, chúng ta sẽ tập trung vào 5 nguyên âm cơ bản. Đây là nền tảng quan trọng nhất để phát âm chuẩn tiếng Nhật.</p>
                    
                    <h4>Điểm cần lưu ý:</h4>
                    <ul>
                       <li><strong>Âm U (う):</strong> Khác với tiếng Việt, môi không tròn và không chu ra phía trước. Hơi dẹt miệng.</li>
                       <li><strong>Âm I (い):</strong> Kéo mép sang hai bên như đang cười nhẹ.</li>
                    </ul>
                    <div className="not-prose mt-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl flex items-start gap-3">
                        <Trophy className="text-amber-500 shrink-0 mt-0.5" size={20}/>
                        <div>
                            <p className="font-bold text-amber-800 mb-1">Mẹo ghi nhớ!</p>
                            <p className="text-sm text-amber-700">Hãy soi gương khi luyện phát âm để đảm bảo khẩu hình miệng đúng như Sensei hướng dẫn.</p>
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* ----- RIGHT: SMART SIDEBAR (CURRICULUM & CHAT) ----- */}
        <div className="w-[360px] lg:w-[400px] bg-white border-l border-slate-200 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] flex flex-col z-30 hidden lg:flex">
          
          {/* Modern Segmented Tab Control */}
          <div className="p-5 border-b border-slate-100 bg-white">
             <div className="bg-slate-100/70 p-1.5 rounded-2xl flex font-bold text-sm relative backdrop-blur-sm">
                {/* Sliding background pill (optional, hard to do pure CSS, simulated here) */}
                <div className={`absolute inset-y-1.5 w-[calc(50%-0.375rem)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out ${activeTab === 'curriculum' ? 'left-1.5' : 'left-[calc(50%+0.375rem)]'}`}></div>

                <button 
                  onClick={() => setActiveTab('curriculum')}
                  className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all relative z-10 ${activeTab === 'curriculum' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <List size={18} weight={activeTab === 'curriculum' ? "bold" : "regular"} /> Nội dung
                </button>
                <button 
                  onClick={() => setActiveTab('ai-chat')}
                  className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all relative z-10 ${activeTab === 'ai-chat' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <Sparkles size={18} weight={activeTab === 'ai-chat' ? "bold" : "regular"} className={activeTab === 'ai-chat' ? "animate-pulse" : ""}/> AI Sensei
                </button>
             </div>
          </div>

          {/* SIDEBAR CONTENT CONTAINER */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#FCFDFC] relative">
            
            {/* === TAB 1: CURRICULUM === */}
            {activeTab === 'curriculum' && (
               <div className="absolute inset-0 p-5 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-300">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 text-lg">Danh sách bài học</h3>
                    <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><MoreVertical size={20}/></button>
                 </div>
                 
                 <div className="space-y-8">
                     {/* Section 1 */}
                     <div>
                        <div className="flex items-center gap-3 mb-3 px-1">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">C1</div>
                            <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Làm quen cơ bản</h4>
                        </div>
                        <div className="space-y-1 pl-4 border-l-2 border-slate-100 ml-4">
                           {lessons.slice(0, 3).map(l => (
                              <LessonCard key={l.id} lesson={l} isActive={l.id === currentLessonId} onClick={() => setCurrentLessonId(l.id)} />
                           ))}
                        </div>
                     </div>
                     {/* Section 2 */}
                     <div>
                        <div className="flex items-center gap-3 mb-3 px-1">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">C2</div>
                            <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Luyện tập & Kiểm tra</h4>
                        </div>
                        <div className="space-y-1 pl-4 border-l-2 border-slate-100 ml-4">
                           {lessons.slice(3).map(l => (
                              <LessonCard key={l.id} lesson={l} isActive={l.id === currentLessonId} onClick={() => setCurrentLessonId(l.id)} />
                           ))}
                        </div>
                     </div>
                 </div>
               </div>
            )}

            {/* === TAB 2: AI CHAT ASSISTANT === */}
            {activeTab === 'ai-chat' && (
              <div className="absolute inset-0 flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 bg-slate-50/50">
                <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-20"> {/* pb-20 to make space for fixed input */}
                  {/* AI Welcome */}
                  <div className="flex justify-center">
                     <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">Hôm nay, 10:30 AM</span>
                  </div>

                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex max-w-[85%] gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {msg.sender === 'ai' ? (
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow-sm text-white mt-0.5 ring-2 ring-white">
                            <Sparkles size={16} />
                          </div>
                        ) : (
                          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-9 h-9 rounded-xl border-2 border-white shadow-sm mt-0.5" alt=""/>
                        )}
                        
                        <div className={`p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm relative group
                          ${msg.sender === 'user' 
                            ? 'bg-emerald-600 text-white rounded-tr-sm' 
                            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'}`}
                        >
                          {msg.text}
                          {/* Timestamp on hover */}
                           <span className={`absolute bottom-0.5 text-[9px] opacity-0 group-hover:opacity-70 transition-opacity whitespace-nowrap
                             ${msg.sender === 'user' ? 'right-full mr-2 text-slate-400' : 'left-full ml-2 text-slate-400'}
                           `}>10:32 AM</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* CHAT INPUT (Fixed at bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200/80 backdrop-blur-md">
                  <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
                    <div className="flex-1 relative">
                        <textarea
                        value={inputMsg}
                        onChange={(e) => setInputMsg(e.target.value)}
                        placeholder="Hỏi Sensei AI về bài học..."
                        className="w-full pl-4 pr-12 py-3 bg-slate-100 border-transparent focus:bg-white border focus:border-indigo-500 rounded-2xl focus:outline-none transition-all text-sm font-medium resize-none max-h-32 min-h-[48px]"
                        rows={1}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                        />
                        <button
                        type="button"
                        className="absolute right-3 bottom-3 text-slate-400 hover:text-indigo-500 transition-colors"
                        >
                        <FileText size={20} />
                        </button>
                    </div>
                    <button
                      type="submit"
                      disabled={!inputMsg.trim()}
                      className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:bg-slate-300 shadow-md hover:shadow-indigo-200/50 hover:scale-105 active:scale-95 h-[48px] w-[48px] flex items-center justify-center"
                    >
                      <Send size={20} className={inputMsg.trim() ? "-translate-x-0.5 translate-y-0.5" : ""}/>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}