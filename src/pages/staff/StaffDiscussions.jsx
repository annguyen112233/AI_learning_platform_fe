import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  MessageSquare,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  HelpCircle,
  CornerDownRight,
  Clock,
  Send,
  ThumbsUp,
  Trash2,
  EyeOff,
  Star
} from 'lucide-react';

// --- MOCK DATA: DANH SÁCH BÌNH LUẬN/HỎI ĐÁP ---
const DISCUSSIONS = [
  {
    id: 1,
    user: "Hoàng Minh",
    avatar: "HM",
    avatarColor: "bg-blue-100 text-blue-600",
    course: "ReactJS Pro 2024",
    lesson: "Bài 12: useEffect Hook",
    content: "Thầy ơi cho em hỏi, tại sao dependency array để rỗng thì nó chỉ chạy 1 lần ạ? Em chưa hiểu cơ chế mount lắm.",
    timestamp: "15 phút trước",
    type: "QUESTION", // QUESTION | DISCUSSION
    status: "UNANSWERED", // UNANSWERED | ANSWERED
    likes: 12
  },
  {
    id: 2,
    user: "Nguyễn Thảo",
    avatar: "NT",
    avatarColor: "bg-purple-100 text-purple-600",
    course: "UX/UI Design",
    lesson: "Bài 5: Tư duy màu sắc",
    content: "Bài giảng hay quá, cảm ơn team nhiều ạ! <3",
    timestamp: "45 phút trước",
    type: "DISCUSSION",
    status: "READ",
    likes: 5
  },
  {
    id: 3,
    user: "Trần Văn C",
    avatar: "TC",
    avatarColor: "bg-slate-100 text-slate-600",
    course: "NodeJS Backend",
    lesson: "Bài 2: Cài đặt MongoDB",
    content: "Em cài bị lỗi 'Connection refused' trên Mac M1, có ai fix được chưa ạ?",
    timestamp: "2 giờ trước",
    type: "QUESTION",
    status: "UNANSWERED",
    likes: 0
  },
  {
    id: 4,
    user: "Phạm Hùng",
    avatar: "PH",
    avatarColor: "bg-orange-100 text-orange-600",
    course: "ReactJS Pro 2024",
    lesson: "Bài 15: Redux Toolkit",
    content: "Đã xong bài tập, mọi người review giúp mình nhé: github.com/hung/pj1",
    timestamp: "5 giờ trước",
    type: "DISCUSSION",
    status: "READ",
    likes: 8
  }
];

// Mẫu câu trả lời nhanh cho Staff
const QUICK_REPLIES = [
  "Cảm ơn bạn đã phản hồi tích cực! Chúc bạn học tốt.",
  "Chào bạn, bạn vui lòng chụp ảnh màn hình lỗi gửi vào nhóm Zalo để được support nhanh nhé.",
  "Bạn thử kiểm tra lại version của Node.js xem sao nhé.",
  "Vấn đề này đã được giải thích kỹ ở phút 15:30 trong video, bạn xem lại giúp mình nha."
];

export default function StaffDiscussions() {
  const [filter, setFilter] = useState('ALL'); // ALL, QUESTIONS, UNANSWERED
  const [replyingTo, setReplyingTo] = useState(null); // ID của comment đang trả lời
  const [replyText, setReplyText] = useState("");

  // Filter Logic
  const filteredData = useMemo(() => {
    if (filter === 'UNANSWERED') return DISCUSSIONS.filter(d => d.type === 'QUESTION' && d.status === 'UNANSWERED');
    if (filter === 'QUESTIONS') return DISCUSSIONS.filter(d => d.type === 'QUESTION');
    return DISCUSSIONS;
  }, [filter]);

  // Actions
  const handleReplyClick = (id) => {
    if (replyingTo === id) {
        setReplyingTo(null); // Toggle off
    } else {
        setReplyingTo(id);
        setReplyText("");
    }
  };

  const submitReply = (id) => {
    if (!replyText.trim()) return;
    toast.success("Đã gửi câu trả lời thành công!");
    setReplyingTo(null);
    setReplyText("");
    // Logic cập nhật status comment thành ANSWERED ở đây
  };

  const useQuickReply = (text) => {
    setReplyText(text);
  };

  return (
    <div className="space-y-6 font-sans text-slate-800 animate-fade-in-up">
      
      {/* 1. HEADER & STATS */}
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
             <MessageSquare className="text-blue-600" size={28} /> Q&A & Bình luận
          </h1>
          <p className="text-slate-500 font-medium mt-1">Quản lý tương tác, giải đáp thắc mắc học viên.</p>
        </div>
        
        {/* Quick Stats Widget */}
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 px-3">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                <span className="text-xs font-bold text-slate-500">2 câu hỏi mới</span>
            </div>
             <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 px-3">
                <span className="text-xs font-bold text-slate-500">Hôm nay: <span className="text-slate-800">45 cmt</span></span>
            </div>
        </div>
      </div>

      {/* 2. TOOLBAR (Filter & Search) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Filter Tabs */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-wrap gap-2">
              <button 
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${filter === 'ALL' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
              >
                  Tất cả
              </button>
              <button 
                onClick={() => setFilter('UNANSWERED')}
                className={`px-4 py-2 rounded-lg text-sm font-bold border flex items-center gap-2 transition-all ${filter === 'UNANSWERED' ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
              >
                  <HelpCircle size={16}/> Cần trả lời
              </button>
              <button 
                onClick={() => setFilter('QUESTIONS')}
                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${filter === 'QUESTIONS' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
              >
                  Chỉ xem Hỏi đáp
              </button>
          </div>

          {/* Search */}
          <div className="md:col-span-5 lg:col-span-4 relative">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input 
                type="text" 
                placeholder="Tìm nội dung hoặc tên học viên..." 
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none shadow-sm"
             />
          </div>
      </div>

      {/* 3. DISCUSSION LIST */}
      <div className="space-y-4">
        {filteredData.map((item) => (
            <div key={item.id} className={`bg-white rounded-2xl border transition-all ${item.status === 'UNANSWERED' ? 'border-rose-100 shadow-sm' : 'border-slate-100 hover:border-blue-100'}`}>
                <div className="p-5">
                    
                    {/* Top Row: User & Context */}
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${item.avatarColor}`}>
                                {item.avatar}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    {item.user}
                                    {item.type === 'QUESTION' && (
                                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100 font-bold uppercase">
                                            Câu hỏi
                                        </span>
                                    )}
                                </h4>
                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                    <Clock size={12}/> {item.timestamp} 
                                    <span className="mx-1">•</span> 
                                    <span className="text-slate-500 font-medium hover:text-blue-600 cursor-pointer">{item.lesson}</span>
                                </p>
                            </div>
                        </div>
                        
                        {/* More Options */}
                        <button className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
                            <MoreHorizontal size={20}/>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="pl-14">
                        <p className="text-slate-700 text-sm leading-relaxed mb-3">
                            {item.content}
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                             <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                <ThumbsUp size={14}/> {item.likes > 0 ? item.likes : 'Thích'}
                             </button>
                             
                             <button 
                                onClick={() => handleReplyClick(item.id)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${replyingTo === item.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 hover:text-blue-600'}`}
                             >
                                <MessageSquare size={14}/> Trả lời
                             </button>

                             {item.status === 'UNANSWERED' && (
                                 <span className="text-rose-500 flex items-center gap-1 ml-auto animate-pulse">
                                     <HelpCircle size={14}/> Chưa được giải đáp
                                 </span>
                             )}
                        </div>
                    </div>
                </div>

                {/* INLINE REPLY FORM (Expandable) */}
                {replyingTo === item.id && (
                    <div className="border-t border-slate-100 bg-slate-50/50 p-4 pl-16 rounded-b-2xl animate-slide-down">
                        
                        {/* Quick Replies Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {QUICK_REPLIES.map((qr, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => useQuickReply(qr)}
                                    className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded hover:border-blue-300 hover:text-blue-600 transition-colors"
                                >
                                    {qr.substring(0, 30)}...
                                </button>
                            ))}
                        </div>

                        <div className="relative">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={`Trả lời ${item.user}...`}
                                className="w-full p-3 pr-12 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none min-h-[80px] bg-white"
                                autoFocus
                            />
                            <button 
                                onClick={() => submitReply(item.id)}
                                className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-200 disabled:opacity-50"
                                disabled={!replyText.trim()}
                            >
                                <Send size={16}/>
                            </button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                             <p className="text-[10px] text-slate-400">Nhấn Enter để xuống dòng. Shift+Enter để gửi.</p>
                             <div className="flex gap-2">
                                 <button className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors" title="Xóa bình luận này"><Trash2 size={16}/></button>
                                 <button className="p-2 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors" title="Ẩn bình luận"><EyeOff size={16}/></button>
                             </div>
                        </div>
                    </div>
                )}
            </div>
        ))}

        {filteredData.length === 0 && (
             <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                 <div className="inline-flex p-4 rounded-full bg-slate-50 text-slate-300 mb-3">
                     <MessageSquare size={32}/>
                 </div>
                 <p className="text-slate-500 font-medium">Không tìm thấy nội dung nào.</p>
             </div>
        )}
      </div>

      {/* Load More */}
      <div className="text-center pt-4">
          <button className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
              Xem các bình luận cũ hơn
          </button>
      </div>

    </div>
  );
}