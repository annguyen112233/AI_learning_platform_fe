import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, CheckCircle2, Lock, MessageSquare, List, Send, Sparkles,
  ChevronLeft, Flame, Trophy, FileText, Download, Share2, Menu, X, Check
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getCourseById } from '@/services/courseService';
import { completeLesson } from '@/services/lessonService';
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, ArrowLeft } from 'lucide-react';

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
              <span className="font-bold text-xs">{lesson.order}</span>}
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
  const { user: currentUser } = useAuth();
  const isModerator = currentUser?.role === 'STAFF' || currentUser?.role === 'ADMIN';

  // State quản lý dữ liệu
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Theo dõi lesson nào đã completed (lessonId → boolean)
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());
  const [completing, setCompleting] = useState(false);

  // YouTube IFrame API
  const iframeRef     = useRef(null);
  const ytPlayerRef   = useRef(null);   // YouTube Player instance
  const autoCompleted = useRef(false);  // Đảm bảo chỉ auto-complete 1 lần / lesson

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
          lessons: (mod.lessons || []).map((les, index) => ({
            id: les.lessonId,
            order: index + 1,
            title: les.title,
            duration: "10:00", // Placeholder
            status: 'unlocked', // Logic check status nên làm ở backend
            videoUrl: les.videoUrl,
            documentUrl: les.documentUrl || "Chưa cập nhật tài liệu",
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

  // ── YouTube auto-complete ───────────────────────────────────────────────────
  // Hàm tiện ích: kiểm tra URL có phải YouTube không
  const isYouTubeUrl = (url) => url && (
    url.includes('youtube.com') || url.includes('youtu.be') || url.includes('youtube-nocookie.com')
  );

  // Build YouTube embed URL với enablejsapi=1
  const buildYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    // Nếu đã là embed URL
    let embedUrl = url;
    if (url.includes('watch?v=')) {
      const videoId = new URL(url).searchParams.get('v');
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    // Thêm params cần thiết
    const separator = embedUrl.includes('?') ? '&' : '?';
    return `${embedUrl}${separator}enablejsapi=1&rel=0&modestbranding=1`;
  };

  // Gọi completeLesson (dùng useCallback để dùng trong event listener)
  const autoCompleteLesson = useCallback(async (lessonId) => {
    if (!lessonId || autoCompleted.current) return;
    if (completedLessonIds.has(lessonId)) return;
    autoCompleted.current = true;
    try {
      const res = await completeLesson(lessonId);
      const { completedLessons, totalLessons, progressPercent } = res.data?.data || {};
      setCompletedLessonIds(prev => new Set([...prev, lessonId]));
      toast.success(
        `⏹️ Video hoàn thành! Tiến độ: ${progressPercent ?? ''}% (${completedLessons ?? ''}/${totalLessons ?? ''} bài)`,
        { icon: '✅', duration: 3000 }
      );
    } catch (err) {
      console.error('Auto-complete lỗi:', err);
    }
  }, [completedLessonIds]);

  // Lắng nghe postMessage từ YouTube IFrame
  useEffect(() => {
    const handleMessage = (event) => {
      // YouTube gửi dữ liệu dạng JSON string
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        // playerState: 0 = ended, 1 = playing, 2 = paused
        if (data?.event === 'onStateChange' && data?.info === 0) {
          // Video kết thúc → auto complete
          autoCompleteLesson(currentLesson?.id);
        }
      } catch (_) { /* ignore non-JSON messages */ }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentLesson, autoCompleteLesson]);

  // Reset autoCompleted flag khi chuyển sang lesson khác
  useEffect(() => {
    autoCompleted.current = false;
  }, [currentLesson?.id]);

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

  // ✅ Gọi API mark lesson completed
  const handleCompleteLesson = async () => {
    if (!currentLesson || completing) return;
    if (completedLessonIds.has(currentLesson.id)) {
      toast('Bài học này đã được đánh dấu hoàn thành rồi!', { icon: '✅' });
      return;
    }

    try {
      setCompleting(true);
      const res = await completeLesson(currentLesson.id);
      const { completedLessons, totalLessons, progressPercent } = res.data?.data || {};

      // Cập nhật local state để sidebar đổi icon ngay
      setCompletedLessonIds(prev => new Set([...prev, currentLesson.id]));

      toast.success(`✅ Hoàn thành! Tiến độ: ${progressPercent}% (${completedLessons}/${totalLessons} bài)`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Không thể lưu tiến độ, thử lại sau!');
    } finally {
      setCompleting(false);
    }
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
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            title="Quay lại"
          >
            <ArrowLeft size={20} />
          </button>
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
          {isModerator ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold border border-indigo-100">
              <ShieldCheck size={14} />
              <span>MODERATOR VIEW</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-xs font-bold border border-orange-100">
              <Flame size={14} fill="currentColor" />
              <span>3 Ngày</span>
            </div>
          )}
          <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white shadow-sm overflow-hidden">
            <img src={`https://ui-avatars.com/api/?name=User&background=10b981&color=fff`} alt="User" />
          </div>
        </div>
      </header>

      {/* --- BODY --- */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* LEFT: CONTENT AREA (Video & Tabs) */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-100/50 scroll-smooth">

          {/* 1. Video Player Area */}
          <div className="w-full bg-black">
            <div className="w-full px-4 pt-4">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black relative">

                {currentLesson?.videoUrl ? (
                  isYouTubeUrl(currentLesson.videoUrl) ? (
                    // ✔ YouTube iframe với enablejsapi=1
                    <iframe
                      ref={iframeRef}
                      key={currentLesson.id} // force re-mount khi đổi bài
                      src={buildYouTubeEmbedUrl(currentLesson.videoUrl)}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      title={currentLesson.title}
                    />
                  ) : (
                    // ✔ Video thường (mp4...) → dùng thẻ <video> với onEnded
                    <video
                      key={currentLesson.id}
                      src={currentLesson.videoUrl}
                      controls
                      className="w-full h-full"
                      onEnded={() => autoCompleteLesson(currentLesson.id)}
                    />
                  )
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <FileText size={48} className="mb-3 opacity-60" />
                    <p>Bài học dạng tài liệu</p>
                  </div>
                )}

                {/* Badge “Đã hoàn thành” overlay góc trên */}
                {completedLessonIds.has(currentLesson?.id) && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm shadow">
                    <CheckCircle2 size={13} strokeWidth={3} /> Đã hoàn thành
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
                {/* ✅ Nút Hoàn thành bài học */}
                <button
                  onClick={handleCompleteLesson}
                  disabled={completing}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    completedLessonIds.has(currentLesson?.id)
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg active:scale-95'
                  } disabled:opacity-60`}
                >
                  {completing ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check size={16} strokeWidth={3} />
                  )}
                  {completedLessonIds.has(currentLesson?.id) ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
                </button>
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
                  {currentLesson?.documentUrl && (
                    <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm inline-flex items-center gap-4">
                      <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                        <FileText size={24} />
                      </div>

                      <div>
                        <h5 className="font-bold text-slate-800 text-sm">Tài liệu đính kèm</h5>
                        <p className="text-xs text-slate-500">PDF / Tài liệu học</p>
                      </div>

                      <a
                        href={currentLesson.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 ml-4"
                      >
                        Tải xuống
                      </a>
                    </div>
                  )}

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
              {/* Sidebar Header - hiện % tiến độ thực */}
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <List size={18} /> Nội dung khóa học
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Hoàn thành {completedLessonIds.size}/{chapters.reduce((sum, c) => sum + c.lessons.length, 0)} bài học
                </p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${chapters.reduce((sum, c) => sum + c.lessons.length, 0) > 0
                      ? Math.round(completedLessonIds.size * 100 / chapters.reduce((sum, c) => sum + c.lessons.length, 0))
                      : 0}%` }}
                  />
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
                        lesson={{
                          ...lesson,
                          status: completedLessonIds.has(lesson.id) ? 'completed' : lesson.status
                        }}
                        isActive={currentLesson?.id === lesson.id}
                        onClick={isModerator ? () => setCurrentLesson(lesson) : onClick}
                        isModerator={isModerator}
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