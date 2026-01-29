import React, { useState, useEffect, useRef } from 'react';
import {
  Play, CheckCircle2, Lock, MessageSquare, List, Send, Sparkles,
  ChevronLeft, Flame, Trophy, FileText, Download, Share2, Menu, X
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Import service (Giả định đường dẫn)
import { getCourseById } from '@/services/courseService';

// --- COMPONENT: THẺ BÀI HỌC (LESSON CARD) ---
const LessonCard = ({ lesson, isActive, onClick }) => {
  const isLocked = lesson.status === 'locked';
  const isCompleted = lesson.status === 'completed';

  return (
    <div
      onClick={() => !isLocked && onClick(lesson)}
      className={`relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border cursor-pointer select-none
        ${isActive
          ? 'bg-emerald-50 border-emerald-200 shadow-sm'
          : isLocked
            ? 'bg-slate-50 border-transparent opacity-60 cursor-not-allowed'
            : 'bg-white border-slate-100 hover:border-emerald-200 hover:bg-slate-50'
        }
      `}
    >
      {/* Icon trạng thái */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
        ${isCompleted ? 'bg-emerald-100 text-emerald-600' :
          isActive ? 'bg-emerald-600 text-white shadow-md' :
            isLocked ? 'bg-slate-200 text-slate-400' : 'bg-slate-100 text-slate-500'}
      `}>
        {isCompleted ? <CheckCircle2 size={16} strokeWidth={3} /> :
          isLocked ? <Lock size={14} /> :
            isActive ? <Play size={14} fill="currentColor" /> :
              <span className="font-bold text-xs">{lesson.id}</span>}
      </div>

      {/* Thông tin bài */}
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium truncate ${isActive ? 'text-emerald-900' : 'text-slate-700'}`}>
          {lesson.title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
          <span>{lesson.duration || "10:00"}</span>
          {lesson.type === 'quiz' && (
            <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-bold border border-amber-100">QUIZ</span>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE: COURSE PLAYER ---
export default function CoursePlayer() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // State quản lý dữ liệu
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI State
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'discussion' | 'ai-chat'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Toggle sidebar trên mobile/desktop

  // Chat AI State
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', text: 'Xin chào! Mình là trợ lý AI. Bạn có thắc mắc gì về bài học này không?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  // --- 1. Fetch dữ liệu khóa học ---
  useEffect(() => {
    if (!courseId) return;

    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const res = await getCourseById(courseId);
        const data = res.data.data || {}; // Điều chỉnh tùy theo response thực tế của API

        setCourse(data);

        // Giả lập dữ liệu chapters nếu API trả về cấu trúc khác, cần map lại cho đúng
        // Ở đây giả định data.modules giống cấu trúc CourseDetail
        const mappedChapters = (data.modules || []).map(mod => ({
          id: mod.moduleId,
          title: mod.title,
          lessons: (mod.lessons || []).map(les => ({
            id: les.lessonId,
            title: les.title,
            duration: "10:00", // Placeholder
            status: 'unlocked', // Logic check status nên làm ở backend
            videoUrl: les.videoUrl,
            description: "Mô tả bài học..."
          }))
        }));

        setChapters(mappedChapters);

        // Mặc định chọn bài học đầu tiên
        if (mappedChapters.length > 0 && mappedChapters[0].lessons.length > 0) {
          setCurrentLesson(mappedChapters[0].lessons[0]);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Không thể tải khóa học hoặc bạn chưa đăng ký.");
        // navigate("/student/courses"); // Uncomment nếu muốn redirect khi lỗi
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, navigate]);

  // Scroll chat xuống cuối
  useEffect(() => {
    if (activeTab === 'ai-chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeTab]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Giả lập AI trả lời
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Cảm ơn câu hỏi về "${currentLesson?.title}". Đây là câu trả lời mẫu của AI...`
      }]);
    }, 1000);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-500 gap-2">
      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      Đang vào lớp học...
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">

      {/* --- HEADER --- */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link to={`/student/courses`} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h2 className="font-bold text-slate-800 truncate max-w-[200px] md:max-w-md">{course?.title}</h2>
            <p className="text-xs text-slate-500 hidden md:block">Đang học: {currentLesson?.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Nút bật tắt sidebar trên Mobile */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 bg-slate-100 rounded-lg text-slate-600"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Gamification Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-bold border border-orange-100">
            <Flame size={14} fill="currentColor" />
            <span>3 Ngày</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white shadow-sm overflow-hidden">
            <img src={`https://ui-avatars.com/api/?name=User&background=10b981&color=fff`} alt="User" />
          </div>
        </div>
      </header>

      {/* --- BODY --- */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* LEFT: CONTENT AREA (Video & Tabs) */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-100/50 scroll-smooth">

          {/* 1. Video Player Area - Nơi thay đổi giao diện nền */}
          {/* ================= VIDEO AREA (YOUTUBE DESKTOP STYLE) ================= */}
          <div className="w-full bg-black">

            {/* Video wrapper – ăn hết màn hình trừ sidebar */}
            <div className="w-full px-4 pt-4">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">

                {currentLesson?.videoUrl ? (
                  <iframe
                    src={currentLesson.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    title="Video Player"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <FileText size={48} className="mb-3 opacity-60" />
                    <p>Bài học dạng tài liệu</p>
                  </div>
                )}

              </div>
            </div>
          </div>


          {/* 2. Content Info & Tabs */}
          <div className="w-full px-6 pb-20">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">{currentLesson?.title}</h2>
              <div className="flex gap-2">
                <button className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-slate-200 mb-6">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'description' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  Mô tả bài học
                </button>
                <button
                  onClick={() => setActiveTab('ai-chat')}
                  className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'ai-chat' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  <Sparkles size={16} /> Hỏi đáp AI
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {activeTab === 'description' && (
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed">
                    {currentLesson?.description || "Chưa có mô tả chi tiết cho bài học này."}
                  </p>
                  <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm inline-flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                      <Download size={24} />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-800 text-sm">Tài liệu đính kèm</h5>
                      <p className="text-xs text-slate-500">Source code & PDF slide</p>
                    </div>
                    <button className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 ml-4">
                      Tải xuống
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'ai-chat' && (
                <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden h-[500px] flex flex-col">
                  <div className="bg-indigo-50/50 p-4 border-b border-indigo-100 flex items-center gap-2 text-indigo-800 font-bold text-sm">
                    <Sparkles size={16} /> Trợ lý học tập AI
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-700 rounded-tl-none'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Hỏi gì đó về bài học..."
                      className="flex-1 bg-slate-50 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-xl px-4 text-sm transition-all outline-none"
                    />
                    <button type="submit" className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors">
                      <Send size={18} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: SIDEBAR (Curriculum) */}
        <div className={`
            fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 z-30 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
            ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <div className="flex flex-col h-full pt-16 lg:pt-0"> {/* Padding top on mobile for header */}
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <List size={18} /> Nội dung khóa học
              </h3>
              <p className="text-xs text-slate-500 mt-1">Hoàn thành 0/15 bài học</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-emerald-500 w-[0%] h-full rounded-full"></div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-6">
              {chapters.map((chapter, idx) => (
                <div key={chapter.id || idx}>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
                    {chapter.title}
                  </h4>
                  <div className="space-y-2">
                    {chapter.lessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        isActive={currentLesson?.id === lesson.id}
                        onClick={setCurrentLesson}
                      />
                    ))}
                  </div>
                </div>
              ))}
              {chapters.length === 0 && (
                <div className="text-center text-slate-400 text-sm mt-10">Chưa có bài học nào</div>
              )}
            </div>
          </div>
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

      </div>
    </div>
  );
}