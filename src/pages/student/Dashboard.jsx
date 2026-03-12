import React, { useState, useEffect } from 'react';
import { getStudentDashboard, getAllCourses } from '@/services/courseService';
import { submitReview } from '@/services/reviewService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import {
  Play,
  Clock,
  Award,
  BookOpen,
  TrendingUp,
  Zap,
  Star,
  MessageSquare,
  X,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

export default function StudentDashboard() {
  // Dashboard overall data
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Courses List state (paginated)
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  
  // Review Modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  
  const navigate = useNavigate();

  // Fetch Dashboard Stats & Recent Course
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getStudentDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Courses with Search, Sort, Pagination
  const fetchCourses = async (page = 1) => {
    try {
      setLoadingCourses(true);
      const response = await getAllCourses(page, 10, search, sortBy);
      const data = response.data.data;
      setCourses(data.data);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages
      });
    } catch (error) {
      toast.error("Không thể tải danh sách khóa học");
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchCourses(1);
  }, [sortBy]);

  // Handle Search Debouncing (Custom)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCourses(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCourses(newPage);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/student/course/${courseId}`);
  };

  const handleOpenReview = (e) => {
    e.stopPropagation();
    if (dashboardData?.recentCourse?.progressPercentage < 50) {
      toast.error("Bạn cần hoàn thành ít nhất 50% khóa học để thực hiện đánh giá.");
      return;
    }
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      toast.error("Vui lòng nhập bình luận");
      return;
    }

    try {
      setSubmittingReview(true);
      await submitReview({
        courseId: dashboardData.recentCourse.courseId,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      toast.success("Cảm ơn bạn đã đánh giá!");
      setShowReviewModal(false);
      setReviewForm({ rating: 5, comment: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Gửi đánh giá thất bại");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { studentName, learningStreak, stats, recentCourse } = dashboardData || {};

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 space-y-12 font-sans animate-fade-in pb-20">

      {/* 1. Header Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Xin chào, {studentName || "Học viên"}! 👋</h1>
          <p className="text-slate-500 font-medium">Bạn đã hoàn thành 85% mục tiêu tuần này. Cố gắng lên nhé!</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 hover:border-orange-200 transition-colors group">
          <div className="bg-orange-100 p-2.5 rounded-xl text-orange-500 group-hover:scale-110 transition-transform">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chuỗi học tập</p>
            <span className="font-extrabold text-slate-700 text-lg leading-none">{learningStreak || 0} Ngày liên tiếp</span>
          </div>
        </div>
      </div>

      {/* 2. Recent Learning Banner - Premium Style */}
      {recentCourse ? (
        <div className="relative w-full bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-slate-900/20 overflow-hidden group">
          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none group-hover:bg-emerald-500/15 transition-colors duration-700"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-[11px] font-bold tracking-widest uppercase text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse border-4 border-emerald-400/20"></span>
                GẦN ĐÂY • {recentCourse.level}
              </div>

              <div>
                <h2 className="text-4xl md:text-5xl font-black leading-[1.1] mb-4 text-white tracking-tight">
                  {recentCourse.title}
                </h2>
                <div className="flex items-center gap-3 text-slate-400 font-semibold text-lg">
                  <Play size={22} className="text-emerald-500" fill="currentColor" />
                  <span>Tiếp tục: <span className="text-white">{recentCourse.currentLesson}</span></span>
                </div>
              </div>

              <div className="space-y-4 max-w-md">
                <div className="flex justify-between text-sm font-bold items-end">
                  <div className="flex items-center gap-2 text-slate-300">
                     <Clock size={16} className="text-emerald-500" />
                     <span>Còn {recentCourse.remainingMinutes} phút nội dung</span>
                  </div>
                  <span className="text-emerald-400 text-xl font-black">{recentCourse.progressPercentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out"
                    style={{ width: `${recentCourse.progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-5 pt-4">
                <button 
                  onClick={() => navigate(`/student/learning/${recentCourse.courseId}`)}
                  className="flex items-center gap-3 bg-emerald-500 text-white px-10 py-4.5 rounded-2xl font-black hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-emerald-500/20 group/btn"
                >
                  HỌC TIẾP
                  <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
                <button 
                  onClick={handleOpenReview}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white px-8 py-4.5 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95"
                >
                  <Star size={20} className="text-amber-400" />
                  ĐÁNH GIÁ
                </button>
              </div>
            </div>

            <div className="hidden lg:flex justify-end pr-8">
               <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] animate-pulse"></div>
                  <div className="relative w-72 h-72 bg-gradient-to-br from-emerald-500/10 to-transparent border border-white/5 rounded-[3rem] rotate-12 flex items-center justify-center backdrop-blur-2xl">
                     <div className="relative w-60 h-60 bg-slate-800 rounded-[2.5rem] flex items-center justify-center shadow-inner -rotate-12 group-hover:rotate-0 transition-transform duration-700">
                        <Award size={120} className="text-emerald-500 drop-shadow-[0_0_30px_rgba(16,185,129,0.4)]" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* 3. Stats Grid - Modern White Containers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Thời gian học", val: stats?.totalLearningTime || "0h", sub: "Hoạt động tích cực", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Sức mạnh kiến thức", val: (stats?.completionRate || 0) + "%", sub: "Trung bình các khóa", icon: BookOpen, color: "text-violet-600", bg: "bg-violet-50" },
          { label: "Xếp hạng Quiz", val: (stats?.averageScore?.toFixed(1) || 0), sub: "Thành tích thực tế", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="group relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-emerald-100 transition-all duration-500 flex flex-col justify-between overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} -mr-16 -mt-16 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700`}></div>
            
            <div className="relative z-10 flex items-start justify-between mb-8">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <stat.icon size={28} />
                </div>
                <div className="text-right">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full inline-block">
                        {stat.sub}
                    </p>
                </div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter group-hover:text-emerald-600 transition-colors uppercase">
                {stat.val}
              </h3>
              <p className="text-slate-500 font-bold mt-1 text-sm">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Discovery Section - Real Pagination & Filters */}
      <div className="space-y-8 pt-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Khám phá khóa học</h3>
            <p className="text-slate-500 font-medium">Bắt đầu hành trình mới của bạn ngay hôm nay</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative min-w-[300px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
              <input 
                type="text"
                placeholder="Tìm khóa học, giáo viên..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-700 shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative group">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Filter size={18} />
               </div>
               <select 
                 className="pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-slate-700 shadow-sm appearance-none cursor-pointer hover:bg-slate-50 min-w-[200px]"
                 value={sortBy}
                 onChange={(e) => setSortBy(e.target.value)}
               >
                  <option value="recommended">Phù hợp trình độ</option>
                  <option value="trending">Phổ biến nhất</option>
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="rated">Đánh giá cao nhất</option>
               </select>
               <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <chevron-down />
               </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {loadingCourses ? (
             Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl h-[450px] animate-pulse border border-slate-100 shadow-sm"></div>
             ))
          ) : courses?.length > 0 ? courses.map(course => (
            <div
              key={course.courseId}
              onClick={() => handleCourseClick(course.courseId)}
              className="group bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden
                 hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-2 transition-all duration-500
                 cursor-pointer flex flex-col h-full shadow-sm relative"
            >
              <div className="h-64 relative overflow-hidden">
                <img
                  src={course.thumbnailUrl || "https://placehold.co/600x400/059669/white?text=Japanese+Course"}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-slate-900 shadow-sm">
                    {course.level || "N/A"}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md text-white text-sm font-black px-4 py-2 rounded-xl shadow-lg border border-white/10">
                  {course.price === 0 ? 'MIỄN PHÍ' : `${course.price?.toLocaleString()}đ`} 
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-amber-500 font-black text-base bg-amber-50 px-3 py-1 rounded-full">
                    <Star size={16} fill="currentColor" /> {course.rating?.toFixed(1) || "New"}
                  </div>
                  <span className="text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest bg-emerald-50 text-emerald-600">
                    {course.status}
                  </span>
                </div>

                <div className="flex-1">
                  <h4 className="font-black text-2xl text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight mb-3 line-clamp-2 uppercase">
                    {course.title}
                  </h4>
                  <p className="text-slate-500 text-sm font-medium line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 overflow-hidden border border-slate-100">
                           {course.constructorImageUrl ? (
                             <img src={course.constructorImageUrl} className="w-full h-full object-cover" />
                           ) : course.constructorName?.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Instructor</span>
                           <span className="text-xs font-black text-slate-700">{course.constructorName || "Unknown"}</span>
                        </div>
                    </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-45">
                     <ArrowUpRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center space-y-4 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 mt-4">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <Search size={40} />
               </div>
               <div>
                  <h3 className="text-xl font-bold text-slate-800">Không tìm thấy khóa học phù hợp</h3>
                  <p className="text-slate-500">Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc khác nhé.</p>
               </div>
               <button 
                onClick={() => {setSearch(''); setSortBy('trending');}}
                className="text-emerald-600 font-bold hover:underline"
               >
                 Xóa tất cả bộ lọc
               </button>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-10">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1 || loadingCourses}
              className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex items-center gap-2 px-4 font-black text-slate-400">
               <span className="text-slate-900 text-xl">{pagination.currentPage}</span>
               <span className="text-sm">/</span>
               <span>{pagination.totalPages}</span>
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages || loadingCourses}
              className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => !submittingReview && setShowReviewModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="bg-slate-900 p-8 text-white relative">
              <button 
                onClick={() => setShowReviewModal(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>
              <div className="inline-block p-4 bg-emerald-500/20 rounded-2xl mb-4">
                 <Star size={32} className="text-emerald-500" fill="currentColor" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight">Đánh giá khóa học</h3>
              <p className="text-slate-400 font-medium mt-2">Phản hồi của bạn là chìa khóa để cải thiện nội dung học tập.</p>
            </div>

            <form onSubmit={handleSubmitReview} className="p-10 space-y-8">
              <div className="flex flex-col items-center gap-6">
                 <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Trải nghiệm của bạn</p>
                 <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map(star => (
                       <button
                         key={star}
                         type="button"
                         onMouseEnter={() => !submittingReview && setReviewForm({...reviewForm, rating: star})}
                         onClick={() => setReviewForm({...reviewForm, rating: star})}
                         className={`p-1.5 transition-all duration-300 hover:scale-125 ${star <= reviewForm.rating ? "text-amber-400" : "text-slate-200"}`}
                       >
                         <Star size={44} fill={star <= reviewForm.rating ? "currentColor" : "none"} strokeWidth={1} />
                       </button>
                    ))}
                 </div>
                 <div className="h-4">
                    <p className="text-sm font-black text-slate-600 uppercase">
                       {reviewForm.rating === 5 ? "Rất hài lòng! ⭐⭐⭐⭐⭐" : 
                        reviewForm.rating === 4 ? "Hài lòng ⭐⭐⭐⭐" : 
                        reviewForm.rating === 3 ? "Bình thường ⭐⭐⭐" : 
                        reviewForm.rating === 2 ? "Không tốt ⭐⭐" : "Tệ ⭐"}
                    </p>
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare size={14} className="text-emerald-500" /> Chia sẻ thêm chi tiết
                 </label>
                 <textarea 
                    className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all resize-none font-medium text-slate-700 min-h-[140px]"
                    placeholder="Khóa học này có giúp ích cho bạn không? Những điểm nào cần cải thiện?"
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    disabled={submittingReview}
                 />
                 <div className="flex items-start gap-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                    <div className="text-blue-500 mt-0.5"><Zap size={14} /></div>
                    <p className="text-[10px] text-blue-600 font-bold leading-tight italic">AI của chúng tôi sẽ phân tích phản hồi của bạn để đảm bảo cộng đồng luôn văn minh & tích cực.</p>
                 </div>
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] font-black shadow-xl shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest"
              >
                {submittingReview ? (
                   <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                   <>Gửi đánh giá</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}