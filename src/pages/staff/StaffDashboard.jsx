import React, { useState, useEffect } from 'react';
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
import { getStaffDashboard } from '@/services/courseService';
import toast from 'react-hot-toast';

const formatCurrency = (val) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
};

export default function StaffDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState([
    { id: 1, task: 'Duyệt các khóa học đang tồn đọng', done: false, priority: 'high' },
    { id: 2, task: 'Kiểm tra báo cáo doanh thu ngày', done: true, priority: 'medium' },
    { id: 3, task: 'Phản hồi khiếu nại của giảng viên', done: false, priority: 'low' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getStaffDashboard();
        setDashboardData(res.data.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
        toast.error("Không thể tải dữ liệu thống kê");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-slate-500 font-medium">Đang tải dữ liệu dashboard...</span>
      </div>
    );
  }

  const { newStudentsToday, revenueToday, pendingRequests, averageRating, weeklyPerformance, topTrendingCourses } = dashboardData;

  const STATS = [
    { 
      label: 'Học viên mới', 
      value: newStudentsToday.toString(), 
      change: '+100%', 
      isPositive: true, 
      icon: <Users size={22} />, 
      color: 'blue' 
    },
    { 
      label: 'Doanh thu ngày', 
      value: formatCurrency(revenueToday), 
      change: '+8.5%', 
      isPositive: true, 
      icon: <DollarSign size={22} />, 
      color: 'emerald' 
    },
    { 
      label: 'Yêu cầu chờ duyệt', 
      value: pendingRequests.toString().padStart(2, '0'), 
      change: '-', 
      isPositive: true, 
      icon: <Clock size={22} />, 
      color: 'orange' 
    },
    { 
      label: 'Đánh giá khóa học', 
      value: `${averageRating}/5`, 
      change: '+0.1', 
      isPositive: true, 
      icon: <Star size={22} />, 
      color: 'purple' 
    },
  ];

  return (
    <div className="space-y-6 font-sans text-slate-800 animate-fade-in-up">
      
      {/* 1. HEADER & GREETING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 font-medium mt-1">Xin chào, chúc bạn một ngày làm việc hiệu quả!</p>
        </div>
        
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
              <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight truncate">{stat.value}</h3>
              <p className="text-sm font-semibold text-slate-400 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3. CHART SECTION */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <h3 className="font-bold text-lg text-slate-800">Hiệu suất tuần này</h3>
                    <p className="text-xs text-slate-400 font-medium">Lượt đăng ký học viên mới</p>
                </div>
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-1.5 mr-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Học viên</span>
                   </div>
                   <select className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-300 cursor-pointer hover:bg-white transition-colors">
                      <option>7 ngày qua</option>
                   </select>
                </div>
            </div>
            
            <div className="flex-1 relative min-h-[240px] flex flex-col">
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                    {[1, 2, 3, 4].map((_, i) => (
                        <div key={i} className="w-full border-t border-slate-100 border-dashed"></div>
                    ))}
                    <div className="w-full border-t border-slate-200"></div>
                </div>

                {/* Bars Container */}
                <div className="flex-1 flex items-end justify-between gap-3 sm:gap-6 px-2 relative z-10 mt-4">
                    {weeklyPerformance.map((stat, i) => {
                        const maxReg = Math.max(...weeklyPerformance.map(w => w.registrations), 1);
                        const height = (stat.registrations / maxReg) * 100;
                        return (
                            <div key={i} className="flex-1 h-full flex flex-col justify-end group relative pt-8">
                                {/* Floating Tooltip */}
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-30 pointer-events-none">
                                   <div className="bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap flex flex-col items-center">
                                      <span>{stat.registrations} học viên</span>
                                      <div className="w-2 h-2 bg-slate-800 rotate-45 -mb-2 mt-0.5"></div>
                                   </div>
                                </div>

                                {/* Bar Wrapper */}
                                <div className="w-full bg-slate-50/50 rounded-t-xl relative overflow-hidden flex items-end h-full">
                                    <div 
                                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 group-hover:from-blue-500 group-hover:to-blue-300 transition-all duration-500 rounded-t-lg shadow-[0_-4px_12px_rgba(59,130,246,0.15)] relative"
                                        style={{ height: `${Math.max(height, 8)}%` }}
                                    >
                                       {/* Gloss Effect */}
                                       <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 skew-x-[-20deg] translate-x-1/2"></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-6 px-2 uppercase tracking-tight">
                {weeklyPerformance.map(w => (
                  <span key={w.day} className="flex-1 text-center">
                    {w.day.includes(' ') ? w.day.split(' ')[1] : w.day}
                  </span>
                ))}
            </div>
        </div>

        {/* 4. RIGHT COLUMN: WIDGETS */}
        <div className="flex flex-col gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-rose-500"/> Khóa học nổi bật
                </h3>
                <div className="space-y-3">
                    {topTrendingCourses.map((course) => (
                        <div key={course.courseId} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex-shrink-0 flex items-center justify-center text-[10px] font-bold border border-indigo-100 uppercase">
                                {course.code}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-slate-700 truncate group-hover:text-blue-600 transition-colors">{course.title}</h4>
                                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                    <span className="flex items-center gap-1"><Users size={12}/> {course.students}</span>
                                    <span className="flex items-center gap-1 text-yellow-500"><Star size={12} fill="currentColor"/> {course.rating.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-5 rounded-2xl shadow-lg shadow-indigo-200 text-white">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold flex items-center gap-2">
                        <CheckSquare size={18}/> Việc cần làm
                    </h3>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-bold">{todos.filter(t => !t.done).length} còn lại</span>
                </div>
                <p className="text-indigo-200 text-xs mb-4">Hoàn thành các công việc hôm nay nhé!</p>
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
      
      {/* 5. RECENT FEEDBACK */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <div className="flex items-center gap-2">
                <MessageCircle size={20} className="text-slate-400"/>
                <h3 className="font-bold text-lg text-slate-800">Thông báo hệ thống</h3>
             </div>
        </div>
        <div className="p-10 text-center text-slate-400 italic text-sm">
            Hiện tại chưa có thông báo hoặc phản hồi mới từ học viên.
        </div>
      </div>

    </div>
  );
}