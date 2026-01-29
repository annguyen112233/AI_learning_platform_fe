import { useState } from "react";
import { createPortal } from "react-dom";
import {
  Plus,
  X,
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Sparkles,
  FileText,
  Zap,
  Clock,
} from "lucide-react";
import CreateLessonByUpload from "./CreateLesson";
import CourseManager from "./CourseManager";
import CreateCourse from "./CreateCourse";

export default function InstructorDashboard() {
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const handleCourseCreated = () => {
    setReloadKey((prev) => prev + 1);
    setShowCreateCourse(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-10 font-sans">
      {/* ================= HEADER WELCOME ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Xin chào, Giảng viên! 👋
          </h1>
          <p className="text-slate-500">
            Sẵn sàng tạo nội dung học tập tuyệt vời hôm nay chưa?
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
          <div className="bg-orange-100 p-1.5 rounded-full text-orange-500">
            <Zap size={16} fill="currentColor" />
          </div>
          <span className="font-bold text-slate-700">Instructor Portal</span>
        </div>
      </div>

      {/* ================= HERO BANNER ================= */}
      <div className="relative w-full bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-emerald-900/10 overflow-hidden group">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-800/40 backdrop-blur-sm border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase text-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              AI-Powered Learning Platform
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2 text-white">
                Instructor Dashboard
              </h2>
              <p className="text-emerald-100/80 text-lg font-medium">
                Tạo và quản lý khóa học của bạn với công nghệ AI.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-emerald-100">
                <span className="flex items-center gap-2">
                  <BookOpen size={16} /> 12 Khóa học
                </span>
                <span>284 Học viên</span>
              </div>
              <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div className="w-3/4 h-full bg-gradient-to-r from-emerald-300 to-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setShowCreateCourse(!showCreateCourse)}
                className="flex items-center gap-3 bg-white text-emerald-700 px-6 py-3.5 rounded-xl font-bold hover:bg-emerald-50 hover:scale-105 hover:shadow-lg hover:shadow-emerald-900/20 transition-all duration-300"
              >
                <Plus size={20} />
                Tạo Khóa học mới
              </button>
            </div>
          </div>

          {/* Illustration bên phải */}
          <div className="hidden md:flex justify-center items-center relative">
            <div className="relative w-48 h-48 bg-emerald-500/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 shadow-inner">
              <div className="absolute inset-0 border-2 border-white/20 rounded-full scale-110 animate-spin-slow"></div>
              <Award size={100} className="text-emerald-100 drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Tổng doanh thu",
            val: "45,000,000 đ",
            sub: "+15% tháng này",
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Khóa học đã tạo",
            val: "12",
            sub: "Đang hoạt động",
            icon: BookOpen,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Học viên",
            val: "284",
            sub: "+42 tuần này",
            icon: Users,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
          {
            label: "Đánh giá TB",
            val: "4.8 ⭐",
            sub: "Xuất sắc",
            icon: Award,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300 flex items-start justify-between"
          >
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">
                {stat.label}
              </p>
              <h3 className="text-3xl font-bold text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">
                {stat.val}
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-2 bg-slate-50 inline-block px-2 py-1 rounded-md">
                {stat.sub}
              </p>
            </div>
            <div
              className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}
            >
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* ================= STEP 1: COURSE MANAGEMENT ================= */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Quản lý Khóa học
              </h3>
            </div>
            <p className="text-slate-500 text-sm">
              Tạo và quản lý nội dung học tập của bạn
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="p-6">
            <CourseManager key={reloadKey} reloadKey={reloadKey} />
          </div>
        </div>
      </div>

      {/* ================= CREATE COURSE MODAL ================= */}
      {showCreateCourse &&
        createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 relative">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Plus size={24} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Tạo Khóa học mới
                  </h3>
                </div>
                <button
                  onClick={() => setShowCreateCourse(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                <CreateCourse onCreated={handleCourseCreated} />
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* ================= STEP 2: AI QUIZ ================= */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                AI Quiz & Bài tập
              </h3>
            </div>
            <p className="text-slate-500 text-sm">
              Tạo bài tập tự động với công nghệ AI
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="group bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md hover:scale-[1.02] flex items-center justify-center gap-3">
                <Sparkles size={20} />
                <span>Tạo AI Quiz tự động</span>
              </button>
              <button className="group border-2 border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 px-6 py-5 rounded-xl font-medium transition-all hover:scale-[1.02] flex items-center justify-center gap-3">
                <FileText size={20} />
                <span>Tạo Bài tập thủ công</span>
              </button>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-sm text-amber-800 flex items-center gap-2">
                <span className="text-lg">💡</span>
                <span>
                  <strong>Lưu ý:</strong> Yêu cầu AI Premium và nội dung bài học
                  đã hoàn thành
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= STEP 3: REVENUE DETAIL ================= */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Tổng quan Doanh thu
              </h3>
            </div>
            <p className="text-slate-500 text-sm">
              Theo dõi thu nhập và hiệu suất khóa học
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100 hover:shadow-md transition-all">
                <p className="text-sm font-medium text-slate-600 mb-2">
                  Doanh thu tháng này
                </p>
                <p className="text-3xl font-bold text-emerald-700 mb-2">
                  12,500,000 đ
                </p>
                <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-100 inline-block px-2 py-1 rounded-md">
                  <TrendingUp size={14} />
                  <span>+15% so với tháng trước</span>
                </p>
              </div>

              <div className="group p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-100 hover:shadow-md transition-all">
                <p className="text-sm font-medium text-slate-600 mb-2">
                  Tổng doanh thu
                </p>
                <p className="text-3xl font-bold text-green-700 mb-2">
                  45,000,000 đ
                </p>
                <p className="text-xs text-slate-500 bg-slate-100 inline-block px-2 py-1 rounded-md">
                  Tất cả thời gian
                </p>
              </div>

              <div className="group p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100 hover:shadow-md transition-all">
                <p className="text-sm font-medium text-slate-600 mb-2">
                  Học viên mới
                </p>
                <p className="text-3xl font-bold text-teal-700 mb-2">42</p>
                <p className="text-xs text-slate-500 bg-slate-100 inline-block px-2 py-1 rounded-md">
                  Trong 30 ngày qua
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
