import React from 'react';
import { Play, Clock, Award } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      {/* 1. Hero Banner - Continue Learning */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-lg shadow-blue-200 flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-2 mb-2 text-blue-100 text-sm font-medium">
            <span className="bg-white/20 px-2 py-1 rounded">N5 Beginner</span>
            <span>Bài đang học dở</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Bài 3: Cách chào hỏi và giới thiệu bản thân</h2>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>Còn 15 phút</span>
            </div>
            <div className="w-32 h-2 bg-blue-900/30 rounded-full overflow-hidden">
               <div className="w-2/3 h-full bg-white rounded-full"></div>
            </div>
          </div>
          <Button variant="ghost" className="bg-white text-blue-600 hover:bg-blue-50 border-none">
            <Play size={18} fill="currentColor" /> Tiếp tục học
          </Button>
        </div>
        {/* Decor background */}
        <div className="absolute right-0 bottom-0 opacity-20 transform translate-x-10 translate-y-10">
           <Award size={200} />
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Số giờ đã học", val: "12.5h", color: "bg-blue-50 text-blue-600" },
          { label: "Bài tập đã làm", val: "8/10", color: "bg-rose-50 text-rose-600" },
          { label: "Điểm trung bình", val: "9.2", color: "bg-emerald-50 text-emerald-600" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className={`text-3xl font-bold mt-2 w-fit px-2 rounded ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      {/* 3. Recommended Courses */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Khóa học gợi ý cho bạn</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card giả lập */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                <div className="h-40 bg-slate-200 relative">
                  {/* Ảnh thumbnail giả */}
                  <img src={`https://placehold.co/600x400/e2e8f0/1e293b?text=Course+${item}`} alt="Course" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">1h 45m</div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">N4 Grammar</span>
                    <span className="text-xs text-slate-400">By Sensei AI</span>
                  </div>
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Luyện thi JLPT N4 cấp tốc - Phần ngữ pháp</h4>
                  <div className="mt-4 flex items-center justify-between">
                     <div className="text-yellow-500 text-sm font-bold">★ 4.8</div>
                     <button className="text-blue-600 text-sm font-medium hover:underline">Xem chi tiết</button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}