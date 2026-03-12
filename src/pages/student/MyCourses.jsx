import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Play,
  Clock,
  MoreHorizontal,
  BookOpen,
  Trophy,
  Flame,
  ArrowRight,
  Star
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCoursesForStudent } from '@/services/courseService';

// --- UI COMPONENTS ---
const Button = ({ children, variant = "primary", className, size = "md", ...props }) => {
  const baseStyle = "font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 hover:shadow-emerald-300",
    secondary: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100",
    outline: "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
    ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
    white: "bg-white text-slate-900 hover:bg-slate-50 shadow-md"
  };

  return (
    <button className={`${baseStyle} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const ProgressBar = ({ progress, className = "" }) => (
  <div className={`w-full bg-slate-100 rounded-full h-2 overflow-hidden ${className}`}>
    <div
      className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out relative"
      style={{ width: `${progress}%` }}
    >
      {/* Shine effect */}
      <div className="absolute top-0 left-0 bottom-0 right-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
    </div>
  </div>
);


// --- MAIN PAGE ---
export default function MyCourses() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [courses, setCourses] = useState([]);
  const [lastActiveCourse, setLastActiveCourse] = useState(null);
  const [fetchKey, setFetchKey] = useState(0); // trigger refetch

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCoursesForStudent();
        const pageData = response.data?.data;
        const fetchedData = pageData?.data || response.data?.data || [];
        const list = Array.isArray(fetchedData) ? fetchedData : [];
        setCourses(list);
        if (list.length > 0) setLastActiveCourse(list[0]);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách khóa học:', error);
        setCourses([]);
      }
    };
    fetchCourses();
  }, [fetchKey]); // refetch mỗi khi fetchKey thay đổi

  // Refetch khi tab được focus lại (user quay lại từ CoursePlayer)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setFetchKey(k => k + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Refetch mỗi khi navigate về trang này
  useEffect(() => {
    setFetchKey(k => k + 1);
  }, [location.key]);
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-800">

      {/* 1. HERO HEADER - Gradient Background */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white pt-10 pb-24 px-6 md:px-12 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-emerald-300 font-medium mb-2 text-sm uppercase tracking-wider">
                <Flame size={16} /> Chào mừng trở lại, Minh!
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                Tiếp tục hành trình <br /> chinh phục tiếng Nhật
              </h1>
            </div>

            {/* Stats Cards in Header */}
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl min-w-[140px]">
                <div className="text-emerald-300 text-sm mb-1 font-medium">Đang học</div>
                <div className="text-3xl font-bold">2</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl min-w-[140px]">
                <div className="text-emerald-300 text-sm mb-1 font-medium">Chứng chỉ</div>
                <div className="text-3xl font-bold flex items-center gap-2">1 <Trophy size={20} className="text-yellow-400" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-16 relative z-20 space-y-12">

        {/* 2. CONTINUE LEARNING (Featured Card) */}
        {lastActiveCourse && (
          <section>
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-full md:w-1/3 aspect-video rounded-2xl overflow-hidden relative group shadow-md">
                <img src={lastActiveCourse.thumbnailUrl} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center pl-1 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                    <Play size={24} className="text-emerald-600 fill-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mb-2 inline-block">Học gần nhất</span>
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">{lastActiveCourse.title}</h2>
                    <p className="text-slate-500 text-sm flex items-center gap-2">
                      <Clock size={14} /> Truy cập {lastActiveCourse.lastAccessed} • {lastActiveCourse.instructor}
                    </p>
                  </div>
                  <Button variant="ghost" className="hidden md:flex"><MoreHorizontal size={20} /></Button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-600">Tiến độ hiện tại</span>
                    <span className="text-slate-900">{lastActiveCourse.progressPercentage ?? 0}%</span>
                  </div>
                  <ProgressBar progress={lastActiveCourse.progressPercentage ?? 0} className="h-3" />
                  <p className="text-xs text-slate-400 pt-1">
                    Bạn đang làm rất tốt! Còn {(lastActiveCourse.totalLessons ?? 0) - (lastActiveCourse.completedLessons ?? 0)} bài nữa để hoàn thành.
                  </p>
                </div>

                <div className="pt-2">
                  <Button size="lg" onClick={() => navigate(`/student/learning/${lastActiveCourse.courseId}`)}>
                    Tiếp tục học ngay <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}


        {/* 3. ALL COURSES (Main List) */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-slate-200 pb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BookOpen className="text-slate-400" size={24} /> Khóa học của tôi
            </h3>

            <div className="flex gap-3 w-full md:w-auto">
              {/* Search Box */}
              <div className="relative group flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                />
              </div>

              {/* Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                {['all', 'in-progress', 'completed'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    {tab === 'all' ? 'Tất cả' : tab === 'in-progress' ? 'Đang học' : 'Đã xong'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(courses) && courses.map((course, idx) => (
              <div
                key={course.courseId || course.id || idx}
                className="group flex flex-col bg-white rounded-2xl border border-slate-100 hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden"
              >
                {/* Card Image */}
                <div className="h-48 relative overflow-hidden">
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <Button variant="white" size="sm" className="w-full font-bold" onClick={() => navigate(`/student/learning/${course.courseId}`)}>
                      {(course.progressPercentage ?? 0) === 100 ? 'Xem lại chứng chỉ' : 'Vào học ngay'}
                    </Button>
                  </div>
                  {(course.progressPercentage ?? 0) === 100 && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg flex items-center gap-1">
                      <Trophy size={12} /> Completed
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col gap-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                        {course.category}
                      </span>
                      {course.isPopular && <Star size={14} className="text-yellow-400 fill-yellow-400" />}
                    </div>
                    <h4 className="font-bold text-slate-800 text-lg leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {course.title}
                    </h4>
                    <p className="text-slate-500 text-xs mt-1">{course.instructor}</p>
                  </div>

                  <div className="mt-auto space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>
                        {(course.progressPercentage ?? 0) === 100
                          ? 'Đã hoàn thành'
                          : `${course.completedLessons ?? 0}/${course.totalLessons ?? 0} bài học`}
                      </span>
                      <span className={(course.progressPercentage ?? 0) === 100 ? 'text-emerald-600' : ''}>
                        {course.progressPercentage ?? 0}%
                      </span>
                    </div>
                    <ProgressBar progress={course.progressPercentage ?? 0} className="h-1.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}