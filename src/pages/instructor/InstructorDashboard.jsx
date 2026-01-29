import { useState } from "react";
import {
  Plus,
  X,
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Sparkles,
  FileText,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 max-w-7xl mx-auto space-y-8">
      {/* ================= HEADER BANNER ================= */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white shadow-lg shadow-emerald-200 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                  Instructor Portal
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-2">Instructor Dashboard</h1>
              <p className="text-emerald-100">
                AI-Powered Online Learning Platform - Tạo và quản lý khóa học
                của bạn
              </p>
            </div>
            <div className="hidden md:block">
              <Award size={80} className="opacity-20" />
            </div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-16 translate-y-10">
          <BookOpen size={250} />
        </div>
      </div>

      {/* ================= STATS OVERVIEW ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Tổng doanh thu",
            val: "45,000,000 đ",
            icon: TrendingUp,
            color: "bg-emerald-50 text-emerald-700 border-emerald-100",
          },
          {
            label: "Khóa học đã tạo",
            val: "12",
            icon: BookOpen,
            color: "bg-green-50 text-green-700 border-green-100",
          },
          {
            label: "Học viên",
            val: "284",
            icon: Users,
            color: "bg-teal-50 text-teal-700 border-teal-100",
          },
          {
            label: "Đánh giá TB",
            val: "4.8 ⭐",
            icon: Award,
            color: "bg-lime-50 text-lime-700 border-lime-100",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all ${stat.color}`}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon size={24} className="opacity-60" />
              </div>
              <p className="text-sm font-medium text-slate-600 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold">{stat.val}</p>
            </div>
          );
        })}
      </div>

      {/* ================= STEP 1: COURSE ================= */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-slate-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                1
              </div>
              <h2 className="font-bold text-xl text-slate-800">
                Quản lý Khóa học
              </h2>
            </div>
            <button
              onClick={() => setShowCreateCourse(!showCreateCourse)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
              {showCreateCourse ? (
                <>
                  <X size={18} /> Đóng
                </>
              ) : (
                <>
                  <Plus size={18} /> Tạo Khóa học
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-6">
          <CourseManager key={reloadKey} reloadKey={reloadKey} />
        </div>
      </section>

      {/* ================= CREATE COURSE MODAL ================= */}
      {showCreateCourse && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
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
        </div>
      )}

      {/* ================= STEP 2: AI QUIZ ================= */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              2
            </div>
            <h2 className="font-bold text-xl text-slate-800">
              AI Quiz & Bài tập
            </h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="group bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-4 rounded-xl font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3">
              <Sparkles size={20} />
              <span>Tạo AI Quiz tự động</span>
            </button>
            <button className="group border-2 border-slate-200 hover:border-indigo-300 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 px-6 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-3">
              <FileText size={20} />
              <span>Tạo Bài tập thủ công</span>
            </button>
          </div>
          <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-sm text-amber-800 flex items-center gap-2">
              <span className="text-lg">💡</span>
              <span>
                <strong>Lưu ý:</strong> Yêu cầu AI Premium và nội dung bài học
                đã hoàn thành
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ================= REVENUE DETAIL ================= */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
              3
            </div>
            <h2 className="font-bold text-xl text-slate-800">
              Tổng quan Doanh thu
            </h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
              <p className="text-sm font-medium text-slate-600 mb-2">
                Doanh thu tháng này
              </p>
              <p className="text-3xl font-bold text-emerald-700">
                12,500,000 đ
              </p>
              <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                <TrendingUp size={14} />
                <span>+15% so với tháng trước</span>
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-100">
              <p className="text-sm font-medium text-slate-600 mb-2">
                Tổng doanh thu
              </p>
              <p className="text-3xl font-bold text-green-700">45,000,000 đ</p>
              <p className="text-xs text-slate-500 mt-2">Tất cả thời gian</p>
            </div>

            <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
              <p className="text-sm font-medium text-slate-600 mb-2">
                Học viên mới
              </p>
              <p className="text-3xl font-bold text-teal-700">42</p>
              <p className="text-xs text-slate-500 mt-2">Trong 30 ngày qua</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
