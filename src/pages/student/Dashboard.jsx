import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Zap, 
  MoreHorizontal,
  Bookmark,
  Star
} from 'lucide-react';
// Giả sử bạn vẫn giữ component Button cũ, hoặc dùng button thường nếu chưa có
// import Button from '@/components/ui/Button'; 

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-10 font-sans">
      
      {/* 1. Header Welcome (Mới thêm để trang trọng hơn) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Xin chào, Minh Nhật! 👋</h1>
          <p className="text-slate-500">Sẵn sàng chinh phục N4 hôm nay chưa?</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
          <div className="bg-orange-100 p-1.5 rounded-full text-orange-500">
            <Zap size={16} fill="currentColor" />
          </div>
          <span className="font-bold text-slate-700">12 Ngày liên tiếp</span>
        </div>
      </div>

      {/* 2. Hero Banner (Redesigned) */}
      <div className="relative w-full bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-emerald-900/10 overflow-hidden group">
        
        {/* Background Decor (Hiệu ứng nền) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-800/40 backdrop-blur-sm border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase text-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Đang học dở • N5 Beginner
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2 text-white">
                Bài 3: Cách chào hỏi & <br/> giới thiệu bản thân
              </h2>
              <p className="text-emerald-100/80 text-lg font-medium">Tiếp tục hành trình chinh phục tiếng Nhật của bạn.</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-emerald-100">
                <span className="flex items-center gap-2"><Clock size={16}/> Còn 15 phút</span>
                <span>75% Hoàn thành</span>
              </div>
              <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div className="w-3/4 h-full bg-gradient-to-r from-emerald-300 to-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
              </div>
            </div>

            <div className="pt-2">
              <button className="flex items-center gap-3 bg-white text-emerald-700 px-6 py-3.5 rounded-xl font-bold hover:bg-emerald-50 hover:scale-105 hover:shadow-lg hover:shadow-emerald-900/20 transition-all duration-300">
                <Play size={20} fill="currentColor" />
                Tiếp tục học ngay
              </button>
            </div>
          </div>

          {/* Illustration/Icon bên phải */}
          <div className="hidden md:flex justify-center items-center relative">
             <div className="relative w-48 h-48 bg-emerald-500/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
                <div className="absolute inset-0 border-2 border-white/20 rounded-full scale-110 animate-spin-slow"></div>
                <Award size={100} className="text-emerald-100 drop-shadow-2xl" />
             </div>
          </div>
        </div>
      </div>

      {/* 3. Stats Grid (Thẻ thống kê đẹp hơn) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Tổng giờ học", val: "12.5h", sub: "+2h tuần này", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Bài tập đã làm", val: "85%", sub: "Top 10% lớp", icon: BookOpen, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Điểm trung bình", val: "9.2", sub: "Xuất sắc", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat, idx) => (
          <div 
            key={idx} 
            className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300 flex items-start justify-between"
          >
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">
                {stat.val}
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-2 bg-slate-50 inline-block px-2 py-1 rounded-md">
                {stat.sub}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* 4. Recommended Courses Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Khóa học gợi ý</h3>
            <p className="text-slate-500 text-sm">Dựa trên tiến độ học tập của bạn</p>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex p-1 bg-white border border-slate-100 rounded-xl w-fit shadow-sm">
            {['all', 'grammar', 'listening'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab === 'all' ? 'Tất cả' : tab === 'grammar' ? 'Ngữ pháp' : 'Nghe hiểu'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div 
              key={item} 
              className="group bg-white rounded-2xl border border-slate-200/60 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              {/* Card Image */}
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={`https://placehold.co/600x400/f1f5f9/334155?text=JLPT+N${5-item}+Course`} 
                  alt="Course" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-lg p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer shadow-sm">
                  <Bookmark size={18} />
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-md">
                  1h 45m
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                    item === 1 ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {item === 1 ? 'Ngữ pháp N4' : 'Từ vựng N5'}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                    <Star size={14} fill="currentColor" /> 4.8
                  </div>
                </div>
                
                <h4 className="font-bold text-lg text-slate-800 group-hover:text-emerald-600 transition-colors mb-2 line-clamp-2">
                  Luyện thi JLPT N{5-item} cấp tốc - Chiến lược làm bài điểm cao
                </h4>
                
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
                  Học các mẹo làm bài thi, phân tích ngữ pháp chuyên sâu và luyện đề thực tế.
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                        <img src="https://placehold.co/50x50" alt="Avatar" />
                    </div>
                    <span className="text-xs font-medium text-slate-500">Sensei AI</span>
                  </div>
                  <button className="text-sm font-semibold text-emerald-600 group-hover:underline flex items-center gap-1">
                    Xem ngay <MoreHorizontal size={14}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}