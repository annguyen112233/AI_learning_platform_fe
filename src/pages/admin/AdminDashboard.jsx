import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Users, BookOpen, Clock, AlertTriangle, ArrowUpRight, Eye,
  Calendar, CheckCircle, XCircle, TrendingUp, DollarSign,
  GraduationCap, Loader2
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';
import { getAdminDashboard } from '@/services/adminService';

// ─── Màu sắc cho Pie chart ────────────────────────────────────────────────────
const LEVEL_COLORS = {
  N5: '#22c55e', N4: '#3b82f6', N3: '#a855f7',
  N2: '#f59e0b', N1: '#ef4444', NONE: '#94a3b8',
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, unit = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 shadow-xl rounded-xl px-4 py-3 text-sm font-sans">
        <p className="font-bold text-slate-600 mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-bold text-slate-800">
              {typeof entry.value === 'number'
                ? entry.value.toLocaleString('vi-VN')
                : entry.value}{unit}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ─── ChartCard ────────────────────────────────────────────────────────────────
const ChartCard = ({ title, subtitle, icon: Icon, iconBg, children, action }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
    <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${iconBg}`}><Icon size={18} /></div>
        <div>
          <h2 className="font-bold text-slate-800">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ─── Skeleton loader ──────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingList, setPendingList] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await getAdminDashboard();
        setData(res);
        setPendingList(res.pendingCourses || []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Không thể tải dữ liệu dashboard. Kiểm tra lại kết nối BE.');
        toast.error('Lỗi tải dữ liệu dashboard!');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // ── Approve / Reject pending course ──────────────────────────────────────
  const handleApprove = (course) => {
    setPendingList(prev => prev.filter(c => c.courseId !== course.courseId));
    toast.success(`Đã duyệt: "${course.title}"`);
    // TODO: gọi api verifyCourse khi ADMIN có quyền đó
  };
  const handleReject = (course) => {
    setPendingList(prev => prev.filter(c => c.courseId !== course.courseId));
    toast.error(`Đã từ chối: "${course.title}"`, { style: { background: '#333', color: '#fff' } });
  };

  const today = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // ── Prepare chart data từ response ───────────────────────────────────────
  const userGrowth = data?.userGrowth || [];
  const revenueGrowth = data?.revenueGrowth || [];
  const courseByLevel = (data?.courseByLevel || []).map(c => ({
    name: c.level === 'NONE' ? 'Khác' : c.level,
    value: c.count,
    color: LEVEL_COLORS[c.level] || '#94a3b8',
  }));

  const stats = data ? [
    {
      label: 'Chờ duyệt',
      value: pendingList.length,
      desc: 'Khóa học đang đợi',
      icon: Clock,
      bg: 'bg-orange-50', iconColor: 'text-orange-500',
      trend: `${data.totalPendingCourses} khóa`,
      trendColor: 'text-orange-600 bg-orange-50 border-orange-100'
    },
    {
      label: 'Tổng người dùng',
      value: data.totalUsers.toLocaleString('vi-VN'),
      desc: `${data.totalStudents} học viên · ${data.totalInstructors} GV`,
      icon: Users,
      bg: 'bg-blue-50', iconColor: 'text-blue-500',
      trend: `+${data.totalStudents} học viên`,
      trendColor: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      label: 'Doanh thu',
      value: data.totalRevenue != null
        ? (data.totalRevenue / 1_000_000).toFixed(1) + 'M'
        : '0đ',
      desc: 'Tổng VNĐ (đã hoàn thành)',
      icon: DollarSign,
      bg: 'bg-emerald-50', iconColor: 'text-emerald-600',
      trend: `${data.totalEnrollments} giao dịch`,
      trendColor: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      label: 'Tổng khóa học',
      value: data.totalCourses.toLocaleString('vi-VN'),
      desc: `${data.totalApprovedCourses} đã duyệt`,
      icon: BookOpen,
      bg: 'bg-purple-50', iconColor: 'text-purple-500',
      trend: `${data.totalRejectedCourses} bị từ chối`,
      trendColor: 'text-slate-500 bg-slate-50 border-slate-100'
    },
  ] : [];

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-8 font-sans">
        <div className="flex items-center gap-3 text-slate-500 font-semibold">
          <Loader2 size={20} className="animate-spin text-green-600" />
          <span>Đang tải dữ liệu dashboard...</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle size={48} className="text-rose-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">Lỗi tải dữ liệu</h2>
        <p className="text-slate-500 text-sm max-w-md">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-slate-800">

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Dữ liệu thực từ database — cập nhật mỗi lần tải trang.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm">
          <Calendar size={16} className="text-green-600" />
          <span>Hôm nay: {today}</span>
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{s.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${s.bg} ${s.iconColor}`}>
                <s.icon size={22} strokeWidth={2} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={`text-xs flex items-center font-bold px-2 py-0.5 rounded-md border ${s.trendColor}`}>
                <ArrowUpRight size={13} className="mr-0.5" /> {s.trend}
              </span>
              <span className="text-slate-400 font-medium text-xs">{s.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── ROW 1: User Growth + Revenue ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* User Growth */}
        <ChartCard
          title="Tăng trưởng người dùng"
          subtitle="Người dùng mới đăng ký theo tháng (6 tháng gần nhất)"
          icon={TrendingUp} iconBg="bg-blue-50 text-blue-600"
        >
          {userGrowth.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-slate-400 text-sm font-medium">Chưa có dữ liệu</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={userGrowth} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradInstructors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip unit=" người" />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingTop: '12px' }} />
                <Area type="monotone" dataKey="students" name="Học viên" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradStudents)" dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="instructors" name="Giảng viên" stroke="#a855f7" strokeWidth={2.5} fill="url(#gradInstructors)" dot={{ r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Revenue */}
        <ChartCard
          title="Doanh thu"
          subtitle="Tổng doanh thu (VNĐ) theo tháng — 6 tháng gần nhất"
          icon={DollarSign} iconBg="bg-emerald-50 text-emerald-600"
        >
          {revenueGrowth.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-slate-400 text-sm font-medium">Chưa có dữ liệu</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueGrowth} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip content={<CustomTooltip unit="₫" />} />
                <Bar dataKey="revenue" name="Doanh thu" fill="url(#gradRevenue)" radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* ── ROW 2: Pie + Enrollment Line ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Course by Level Pie */}
        <ChartCard
          title="Phân bố khóa học theo cấp độ"
          subtitle="Theo JLPT Level trong hệ thống"
          icon={BookOpen} iconBg="bg-purple-50 text-purple-600"
        >
          {courseByLevel.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-slate-400 text-sm font-medium">Chưa có dữ liệu</div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="55%" height={220}>
                <PieChart>
                  <Pie data={courseByLevel} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                    {courseByLevel.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} khóa`, name]} contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', fontSize: '13px', fontWeight: 600 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {courseByLevel.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-xs font-semibold text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-xs font-extrabold text-slate-700 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{item.value}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-100 flex justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Tổng</span>
                  <span className="text-sm font-extrabold text-slate-700">{courseByLevel.reduce((s, c) => s + c.value, 0)} khóa</span>
                </div>
              </div>
            </div>
          )}
        </ChartCard>

        {/* Summary Stats Card */}
        <ChartCard
          title="Thống kê nhanh"
          subtitle="Tổng hợp số liệu hệ thống"
          icon={GraduationCap} iconBg="bg-amber-50 text-amber-600"
        >
          <div className="space-y-3">
            {[
              { label: 'Tổng học viên', value: data?.totalStudents, color: 'bg-blue-500' },
              { label: 'Tổng giảng viên', value: data?.totalInstructors, color: 'bg-purple-500' },
              { label: 'Khóa học đã duyệt', value: data?.totalApprovedCourses, color: 'bg-emerald-500' },
              { label: 'Khóa học chờ duyệt', value: data?.totalPendingCourses, color: 'bg-orange-500' },
              { label: 'Khóa học bị từ chối', value: data?.totalRejectedCourses, color: 'bg-rose-500' },
              { label: 'Tổng lượt ghi danh', value: data?.totalEnrollments, color: 'bg-teal-500' },
            ].map((row, i) => {
              const max = Math.max(
                data?.totalStudents || 1,
                data?.totalApprovedCourses || 1,
                data?.totalEnrollments || 1
              );
              const pct = Math.min(100, Math.round(((row.value || 0) / max) * 100));
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>{row.label}</span>
                    <span className="font-extrabold text-slate-800">
                      {(row.value || 0).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${row.color} transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* ── PENDING COURSES TABLE ── */}
      <ChartCard
        title="Khóa học chờ duyệt"
        subtitle="Yêu cầu từ giảng viên đang chờ xử lý"
        icon={Clock} iconBg="bg-orange-50 text-orange-500"
        action={
          pendingList.length > 0 ? (
            <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-extrabold border border-orange-200">
              {pendingList.length} khóa
            </span>
          ) : null
        }
      >
        {pendingList.length === 0 ? (
          <div className="py-10 flex flex-col items-center text-slate-400">
            <CheckCircle size={40} className="mb-3 text-emerald-200" />
            <p className="font-semibold text-sm">Tất cả khóa học đã được xử lý!</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 -mb-6">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-100 text-slate-400 text-xs uppercase font-bold tracking-wider">
                  <th className="px-6 py-3.5 pl-8">Khóa học</th>
                  <th className="px-6 py-3.5">Giảng viên</th>
                  <th className="px-6 py-3.5">Cấp độ</th>
                  <th className="px-6 py-3.5">Giá</th>
                  <th className="px-6 py-3.5">Ngày gửi</th>
                  <th className="px-6 py-3.5 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingList.map((course, i) => (
                  <tr key={course.courseId || i} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="px-6 py-4 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center text-xs font-black text-green-700 border border-green-200 flex-shrink-0">
                          {course.title?.substring(0, 2).toUpperCase()}
                        </div>
                        <p className="font-bold text-slate-700 text-sm group-hover:text-green-700 transition-colors line-clamp-1 max-w-[200px]">
                          {course.title}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold border border-green-200 flex-shrink-0">
                          {course.instructorName?.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-600">{course.instructorName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {course.jlptLevel ? (
                        <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                          {course.jlptLevel}
                        </span>
                      ) : <span className="text-xs text-slate-400">—</span>}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                      {course.price != null
                        ? Number(course.price).toLocaleString('vi-VN') + '₫'
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{course.createdAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => toast(`Xem: ${course.title}`, { icon: '👀' })}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => handleApprove(course)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Phê duyệt"
                        >
                          <CheckCircle size={16} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => handleReject(course)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Từ chối"
                        >
                          <XCircle size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ChartCard>

    </div>
  );
}