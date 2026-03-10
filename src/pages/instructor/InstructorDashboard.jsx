import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import {
  Plus, X, BookOpen, Users, TrendingUp, Award, Zap, Clock,
  DollarSign, BarChart2, CheckCircle, AlertCircle, FileEdit,
  XCircle, Loader2, ArrowUpRight, ArrowDownRight, Star, Eye,
  Calendar
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { getInstructorDashboard } from '@/services/adminService';
import CreateCourse from './CreateCourse';
import CourseManager from './CourseManager';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtVND = (n) => {
  if (!n || n === 0) return '0₫';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M₫';
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K₫';
  return n.toLocaleString('vi-VN') + '₫';
};
const pct = (a, b) => {
  if (!b || b === 0) return null;
  const diff = ((a - b) / b) * 100;
  return diff.toFixed(1);
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, unit = '' }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-100 shadow-xl rounded-xl px-4 py-3 text-sm">
        <p className="font-bold text-slate-600 mb-2">{label}</p>
        {payload.map((e, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: e.color }} />
            <span className="text-slate-500">{e.name}:</span>
            <span className="font-bold text-slate-800">
              {typeof e.value === 'number' ? e.value.toLocaleString('vi-VN') : e.value}{unit}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const statusConfig = {
  APPROVED: { label: 'Đã duyệt', dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-100', Icon: CheckCircle },
  PENDING_APPROVAL: { label: 'Chờ duyệt', dot: 'bg-orange-500 animate-pulse', badge: 'bg-orange-50 text-orange-600 border-orange-100', Icon: Clock },
  DRAFT: { label: 'Nháp', dot: 'bg-slate-400', badge: 'bg-slate-50 text-slate-500 border-slate-200', Icon: FileEdit },
  REJECTED: { label: 'Từ chối', dot: 'bg-rose-500', badge: 'bg-rose-50 text-rose-600 border-rose-100', Icon: XCircle },
};

const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function InstructorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const handleCourseCreated = () => {
    setReloadKey(k => k + 1);
    setShowCreate(false);
    // Refresh dashboard data
    fetchDashboard();
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getInstructorDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
      setError('Không thể tải dữ liệu dashboard. Kiểm tra lại kết nối BE.');
      toast.error('Lỗi tải dashboard!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 font-sans">
      <div className="flex items-center gap-3 text-slate-500 font-semibold">
        <Loader2 size={18} className="animate-spin text-emerald-600" />
        <span>Đang tải dashboard...</span>
      </div>
      <Skeleton className="h-48" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28" />)}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center font-sans">
      <AlertCircle size={48} className="text-rose-300 mb-4" />
      <h2 className="text-xl font-bold text-slate-700 mb-2">Lỗi tải dữ liệu</h2>
      <p className="text-slate-500 text-sm">{error}</p>
      <button onClick={fetchDashboard} className="mt-6 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">
        Thử lại
      </button>
    </div>
  );

  // Tính % thay đổi doanh thu
  const revChange = pct(
    Number(data?.currentMonthRevenue || 0),
    Number(data?.lastMonthRevenue || 0)
  );
  const revUp = revChange === null ? null : Number(revChange) >= 0;
  const today = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const topStats = [
    {
      label: 'Tổng doanh thu',
      value: fmtVND(Number(data.totalRevenue)),
      sub: revChange !== null
        ? `${revUp ? '+' : ''}${revChange}% so tháng trước`
        : 'Chưa có dữ liệu tháng trước',
      icon: DollarSign, bg: 'bg-emerald-50', color: 'text-emerald-600',
      trendUp: revUp,
    },
    {
      label: 'Khóa học đã tạo',
      value: data.totalCourses,
      sub: `${data.approvedCourses} đã duyệt · ${data.pendingCourses} chờ`,
      icon: BookOpen, bg: 'bg-blue-50', color: 'text-blue-600',
      trendUp: null,
    },
    {
      label: 'Tổng học viên',
      value: data.totalEnrollments,
      sub: 'Tổng lượt ghi danh',
      icon: Users, bg: 'bg-violet-50', color: 'text-violet-600',
      trendUp: null,
    },
    {
      label: 'Tháng này',
      value: fmtVND(Number(data.currentMonthRevenue)),
      sub: 'Doanh thu tháng hiện tại',
      icon: TrendingUp, bg: 'bg-amber-50', color: 'text-amber-600',
      trendUp: revUp,
    },
  ];

  const revenueData = data.revenueByMonth || [];
  const enrollData = data.enrollmentByMonth || [];
  const topCourses = data.topCourses || [];
  const myCourses = data.myCourses || [];

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 font-sans text-slate-800">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Xin chào, Giảng viên! 👋
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">
            Dữ liệu thực từ database — cập nhật mỗi lần tải trang.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white border border-slate-100 px-4 py-2.5 rounded-xl shadow-sm">
            <Calendar size={15} className="text-emerald-600" />
            <span>{today}</span>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all"
          >
            <Plus size={17} /> Tạo khóa học mới
          </button>
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <div className="relative w-full bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 bg-emerald-800/40 backdrop-blur-sm border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase text-emerald-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Instructor Dashboard
            </span>
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2">Nền tảng AI Learning</h2>
              <p className="text-emerald-100/80 text-base font-medium">
                Tạo & quản lý khóa học với công nghệ AI. Theo dõi học viên và doanh thu theo thời gian thực.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold text-emerald-100">
                <span className="flex items-center gap-2"><BookOpen size={15} /> {data.totalCourses} Khóa học</span>
                <span>{data.totalEnrollments} Học viên</span>
              </div>
              <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-300 to-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-700"
                  style={{ width: `${data.totalCourses > 0 ? Math.min(100, (data.approvedCourses / data.totalCourses) * 100) : 0}%` }}
                />
              </div>
              <p className="text-xs text-emerald-200 font-medium">
                {data.approvedCourses}/{data.totalCourses} khóa học đã được duyệt
              </p>
            </div>
          </div>
          <div className="hidden md:flex justify-center items-center">
            <div className="relative w-40 h-40 bg-emerald-500/20 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
              <div className="absolute inset-0 border-2 border-white/20 rounded-full scale-110 animate-spin" style={{ animationDuration: '8s' }} />
              <Award size={80} className="text-emerald-100 drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {topStats.map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{typeof s.value === 'number' ? s.value.toLocaleString('vi-VN') : s.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
                <s.icon size={22} strokeWidth={2} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {s.trendUp !== null && (
                <span className={`text-xs flex items-center font-bold px-2 py-0.5 rounded-md border ${s.trendUp
                    ? 'text-emerald-600 bg-emerald-50 border-emerald-100'
                    : 'text-rose-600 bg-rose-50 border-rose-100'
                  }`}>
                  {s.trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                </span>
              )}
              <span className="text-slate-400 font-medium text-xs">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── CHARTS ROW ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><DollarSign size={18} /></div>
            <div>
              <h2 className="font-bold text-slate-800">Doanh thu theo tháng</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">6 tháng gần nhất (VNĐ)</p>
            </div>
          </div>
          <div className="p-6">
            {revenueData.every(d => d.revenue === 0 || !d.revenue) ? (
              <div className="h-52 flex flex-col items-center justify-center text-slate-400">
                <BarChart2 size={40} className="mb-3 text-slate-200" />
                <p className="text-sm font-medium">Chưa có doanh thu</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                    tickFormatter={v => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip unit="₫" />} />
                  <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#22c55e" strokeWidth={2.5}
                    fill="url(#gradRev)" dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Enrollment Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600"><Users size={18} /></div>
            <div>
              <h2 className="font-bold text-slate-800">Học viên ghi danh</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Số lượt đăng ký mới theo tháng</p>
            </div>
          </div>
          <div className="p-6">
            {enrollData.every(d => !d.count) ? (
              <div className="h-52 flex flex-col items-center justify-center text-slate-400">
                <Users size={40} className="mb-3 text-slate-200" />
                <p className="text-sm font-medium">Chưa có học viên</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={enrollData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradEnroll" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip unit=" học viên" />} />
                  <Bar dataKey="count" name="Học viên" fill="url(#gradEnroll)" radius={[8, 8, 0, 0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* ── TOP COURSES ── */}
      {topCourses.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600"><Star size={18} /></div>
              <div>
                <h2 className="font-bold text-slate-800">Top khóa học nổi bật</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Theo số học viên ghi danh</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs uppercase font-bold tracking-wider">
                  <th className="px-6 py-3.5 pl-8">#</th>
                  <th className="px-6 py-3.5">Khóa học</th>
                  <th className="px-6 py-3.5">Cấp độ</th>
                  <th className="px-6 py-3.5">Trạng thái</th>
                  <th className="px-6 py-3.5">Học viên</th>
                  <th className="px-6 py-3.5">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {topCourses.map((c, i) => {
                  const sc = statusConfig[c.status] || statusConfig.DRAFT;
                  return (
                    <tr key={c.courseId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 pl-8">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${i === 0 ? 'bg-amber-100 text-amber-700' :
                            i === 1 ? 'bg-slate-100 text-slate-600' :
                              i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-50 text-slate-500'
                          }`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center border border-emerald-200">
                            {c.title?.substring(0, 2).toUpperCase()}
                          </div>
                          <p className="font-bold text-slate-700 text-sm line-clamp-1 max-w-[220px]">{c.title}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {c.jlptLevel
                          ? <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">{c.jlptLevel}</span>
                          : <span className="text-xs text-slate-400">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${sc.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Users size={14} className="text-violet-400" />
                          <span className="font-bold text-slate-700 text-sm">{c.enrollmentCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-700">
                        {fmtVND(Number(c.revenue))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MY COURSES (full list from CourseManager component) ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">1</div>
            <h3 className="text-xl font-extrabold text-slate-900">Quản lý Khóa học</h3>
          </div>
          <div className="flex gap-2 text-xs font-bold">
            {[
              { label: `${data.approvedCourses} Duyệt`, cls: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
              { label: `${data.pendingCourses} Chờ`, cls: 'text-orange-600 bg-orange-50 border-orange-100' },
              { label: `${data.draftCourses} Nháp`, cls: 'text-slate-500 bg-slate-50 border-slate-200' },
              { label: `${data.rejectedCourses} Từ chối`, cls: 'text-rose-600 bg-rose-50 border-rose-100' },
            ].map((t, i) => t.label.startsWith('0') ? null : (
              <span key={i} className={`px-2.5 py-1 rounded-md border ${t.cls}`}>{t.label}</span>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-6">
            <CourseManager key={reloadKey} reloadKey={reloadKey} />
          </div>
        </div>
      </div>

      {/* ── CREATE COURSE MODAL ── */}
      {showCreate && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden relative">
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Plus size={22} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Tạo Khóa học mới</h3>
              </div>
              <button onClick={() => setShowCreate(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors">
                <X size={20} className="text-white" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <CreateCourse onCreated={handleCourseCreated} />
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
