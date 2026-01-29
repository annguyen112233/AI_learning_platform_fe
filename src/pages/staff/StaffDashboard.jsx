import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Search,
  Star,
  CheckSquare,
  MessageCircle,
  Clock,
  FileText
} from 'lucide-react';

// --- MOCK DATA: THỐNG KÊ NGHIỆP VỤ (KPIs) ---
// Staff quan tâm: Học viên mới, Doanh số, Việc tồn đọng, Chất lượng (Đánh giá)
const STATS = [
  { 
    label: 'Học viên mới', 
    value: '128', 
    change: '+12%', 
    isPositive: true, 
    icon: <Users size={22} />, 
    color: 'blue' 
  },
  { 
    label: 'Doanh thu ngày', 
    value: '15.2M ₫', 
    change: '+8.5%', 
    isPositive: true, 
    icon: <DollarSign size={22} />, 
    color: 'emerald' 
  },
  { 
    label: 'Yêu cầu chờ duyệt', 
    value: '05', 
    change: '-2', 
    isPositive: true, 
    icon: <Clock size={22} />, 
    color: 'orange' 
  },
  { 
    label: 'Đánh giá khóa học', 
    value: '4.8/5', 
    change: '+0.2', 
    isPositive: true, 
    icon: <Star size={22} />, 
    color: 'purple' 
  },
];

// --- MOCK DATA: TOP KHÓA HỌC THỊNH HÀNH ---
// Giúp Staff biết thị hiếu học viên để hỗ trợ/duyệt bài tốt hơn
const TOP_COURSES = [
  { id: 1, title: 'ReactJS Pro 2024 - Đi làm ngay', students: 1240, rating: 4.8, code: 'FE-01' },
  { id: 2, title: 'UX/UI Design Masterclass', students: 850, rating: 4.9, code: 'DE-02' },
  { id: 3, title: 'Tiếng Anh Giao Tiếp (Advanced)', students: 2100, rating: 4.5, code: 'LA-03' },
];

// --- MOCK DATA: VIỆC CẦN LÀM (TO-DO LIST) ---
// Công cụ quản lý cá nhân cho Staff
const TODO_LIST = [
  { id: 1, task: 'Duyệt khóa học ReactJS của thầy Sơn', done: false, priority: 'high' },
  { id: 2, task: 'Phản hồi khiếu nại của học viên A', done: true, priority: 'medium' },
  { id: 3, task: 'Kiểm tra báo cáo doanh thu tuần', done: false, priority: 'low' },
];

export default function StaffDashboard() {
  const [todos, setTodos] = useState(TODO_LIST);

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="space-y-6 font-sans text-slate-800 animate-fade-in-up">
      
      {/* 1. HEADER & GREETING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 font-medium mt-1">Xin chào, chúc bạn một ngày làm việc hiệu quả!</p>
        </div>
        
        {/* Quick Actions & Notification */}
        <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Tra cứu nhanh (Học viên, Khóa học)..." 
                  className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all w-72 shadow-sm"
                />
            </div>
            
        </div>
      </div>

      {/* 2. STATS CARDS (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{stat.value}</h3>
              <p className="text-sm font-semibold text-slate-400 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. CHART SECTION (Hiệu suất kinh doanh/hoạt động) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-lg text-slate-800">Hiệu suất tuần này</h3>
                    <p className="text-xs text-slate-400 font-medium">So sánh lượt đăng ký & doanh thu</p>
                </div>
                <select className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-300">
                    <option>7 ngày qua</option>
                    <option>Tháng này</option>
                </select>
            </div>
            
            {/* Mock Chart Visualization (CSS Pure) */}
            <div className="flex-1 flex items-end justify-between gap-4 px-2 min-h-[220px]">
                {[35, 55, 40, 70, 50, 85, 60].map((h, i) => (
                    <div key={i} className="w-full bg-slate-50 rounded-xl relative group overflow-hidden">
                        {/* Bar 1: Doanh thu */}
                        <div 
                            className="absolute bottom-0 inset-x-0 bg-blue-500 opacity-90 group-hover:opacity-100 transition-all duration-500 rounded-xl z-10"
                            style={{ height: `${h}%` }}
                        ></div>
                        {/* Bar 2: Traffic (Background shadow effect) */}
                         <div 
                            className="absolute bottom-0 inset-x-0 bg-emerald-400 opacity-60 group-hover:opacity-80 transition-all duration-500 rounded-xl z-0"
                            style={{ height: `${h * 0.7}%` }}
                        ></div>
                        
                        {/* Tooltip on hover */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold text-xs z-20">
                           {h}tr
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-400 mt-4 px-2 uppercase tracking-wide">
                <span>Thứ 2</span><span>Thứ 3</span><span>Thứ 4</span><span>Thứ 5</span><span>Thứ 6</span><span>Thứ 7</span><span>CN</span>
            </div>
        </div>

        {/* 4. RIGHT COLUMN: WIDGETS */}
        <div className="flex flex-col gap-6">
            
            {/* Widget: Top Trending Courses */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-rose-500"/> Khóa học nổi bật
                </h3>
                <div className="space-y-3">
                    {TOP_COURSES.map((course) => (
                        <div key={course.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex-shrink-0 flex items-center justify-center text-[10px] font-bold border border-indigo-100">
                                {course.code}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-slate-700 truncate group-hover:text-blue-600 transition-colors">{course.title}</h4>
                                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                    <span className="flex items-center gap-1"><Users size={12}/> {course.students}</span>
                                    <span className="flex items-center gap-1 text-yellow-500"><Star size={12} fill="currentColor"/> {course.rating}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Widget: Personal To-do List */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-5 rounded-2xl shadow-lg shadow-indigo-200 text-white">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold flex items-center gap-2">
                        <CheckSquare size={18}/> Việc cần làm
                    </h3>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-bold">{todos.filter(t => !t.done).length} còn lại</span>
                </div>
                <p className="text-indigo-200 text-xs mb-4">Đừng quên hoàn thành trước 17:00 nhé!</p>
                
                <div className="space-y-2">
                    {todos.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => toggleTodo(item.id)}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                        >
                            <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${item.done ? 'bg-emerald-400 border-emerald-400' : 'border-indigo-300'}`}>
                                {item.done && <CheckSquare size={12} className="text-white" />}
                            </div>
                            <span className={`text-sm font-medium transition-all leading-tight ${item.done ? 'text-indigo-300 line-through' : 'text-white'}`}>
                                {item.task}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>
      
      {/* 5. USER FEEDBACK SECTION (Pulse of the Community) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <div className="flex items-center gap-2">
                <MessageCircle size={20} className="text-slate-400"/>
                <h3 className="font-bold text-lg text-slate-800">Phản hồi gần đây</h3>
             </div>
             <button className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all">Xem tất cả</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
            {[1, 2].map((i) => (
                <div key={i} className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all bg-white group">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                                {i === 1 ? 'HA' : 'TB'}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-700">{i === 1 ? 'Hoàng Anh' : 'Trần Bình'}</p>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Học viên ReactJS</p>
                            </div>
                        </div>
                        <div className="flex text-yellow-400 gap-0.5">
                            {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= 4 ? "currentColor" : "none"} className={s > 4 ? "text-slate-300" : ""}/>)}
                        </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg mb-3">
                        <p className="text-sm text-slate-600 italic leading-relaxed">
                            "{i === 1 ? 'Khóa học rất chi tiết, nhưng phần Redux Toolkit thầy nói hơi nhanh. Mong có thêm bài tập thực hành.' : 'Tuyệt vời! Tôi đã làm được project đầu tiên sau 2 tuần.'}"
                        </p>
                    </div>
                    <div className="flex gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button className="flex-1 text-xs font-bold px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                            Phản hồi ngay
                        </button>
                        <button className="text-xs font-bold px-3 py-2 bg-slate-50 text-slate-500 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-colors">
                            Bỏ qua
                        </button>
                    </div>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
}