import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
    BarChart2, TrendingUp, DollarSign, Users, BookOpen,
    CheckCircle, Clock, XCircle, FileEdit, Loader2, AlertTriangle,
    ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Tooltip,
    XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts';
import { getInstructorDashboard } from '@/services/adminService';

const COLORS = ['#22c55e', '#a855f7', '#f97316', '#3b82f6', '#ef4444', '#14b8a6'];

const fmtVND = (n) => {
    if (!n || n === 0) return '0₫';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M₫';
    if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K₫';
    return n + '₫';
};

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

const Skeleton = ({ className = '' }) => <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />;

export default function InstructorAnalytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const res = await getInstructorDashboard();
                setData(res);
            } catch {
                setError('Không thể tải thống kê.');
                toast.error('Lỗi tải thống kê!');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return (
        <div className="space-y-6 font-sans">
            <div className="flex items-center gap-3 text-slate-500 font-semibold">
                <Loader2 size={18} className="animate-spin text-emerald-600" />
                <span>Đang tải thống kê...</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28" />)}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Skeleton className="h-72" /><Skeleton className="h-72" />
            </div>
        </div>
    );

    if (error || !data) return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertTriangle size={48} className="text-rose-300 mb-4" />
            <p className="text-slate-500">{error || 'Lỗi không xác định'}</p>
            <button onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl">Thử lại</button>
        </div>
    );

    // Tính % thay đổi doanh thu
    const cur = Number(data.currentMonthRevenue || 0);
    const prev = Number(data.lastMonthRevenue || 0);
    const revChange = prev > 0 ? (((cur - prev) / prev) * 100).toFixed(1) : null;
    const revUp = revChange !== null ? Number(revChange) >= 0 : null;

    // Pie data cho trạng thái khóa học
    const pieData = [
        { name: 'Đã duyệt', value: data.approvedCourses, color: '#22c55e' },
        { name: 'Chờ duyệt', value: data.pendingCourses, color: '#f97316' },
        { name: 'Nháp', value: data.draftCourses, color: '#94a3b8' },
        { name: 'Từ chối', value: data.rejectedCourses, color: '#ef4444' },
    ].filter(d => d.value > 0);

    // Top course bar data
    const topBarData = (data.topCourses || []).map(c => ({
        name: c.title?.length > 18 ? c.title.substring(0, 18) + '…' : c.title,
        'Học viên': c.enrollmentCount,
        'Doanh thu': Number(c.revenue),
    }));

    const overviewStats = [
        { label: 'Tổng doanh thu', value: fmtVND(Number(data.totalRevenue)), icon: DollarSign, bg: 'bg-emerald-50', color: 'text-emerald-600', change: revChange, up: revUp },
        { label: 'Tổng học viên', value: data.totalEnrollments, icon: Users, bg: 'bg-violet-50', color: 'text-violet-600', change: null },
        { label: 'Tổng khóa học', value: data.totalCourses, icon: BookOpen, bg: 'bg-blue-50', color: 'text-blue-600', change: null },
        { label: 'Tháng này', value: fmtVND(cur), icon: TrendingUp, bg: 'bg-amber-50', color: 'text-amber-600', change: revChange, up: revUp },
    ];

    const courseStatusCards = [
        { label: 'Đã duyệt', value: data.approvedCourses, Icon: CheckCircle, cls: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
        { label: 'Chờ duyệt', value: data.pendingCourses, Icon: Clock, cls: 'text-orange-600 bg-orange-50 border-orange-100' },
        { label: 'Nháp', value: data.draftCourses, Icon: FileEdit, cls: 'text-slate-500 bg-slate-50 border-slate-200' },
        { label: 'Từ chối', value: data.rejectedCourses, Icon: XCircle, cls: 'text-rose-600 bg-rose-50 border-rose-100' },
    ];

    return (
        <div className="space-y-8 font-sans text-slate-800">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Thống kê & Phân tích</h1>
                <p className="text-slate-500 mt-0.5 text-sm font-medium">Dữ liệu thực từ database — cập nhật mỗi lần tải trang.</p>
            </div>

            {/* OVERVIEW STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {overviewStats.map((s, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                                <h3 className="text-2xl font-extrabold text-slate-800 mt-2">{typeof s.value === 'number' ? s.value.toLocaleString('vi-VN') : s.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
                                <s.icon size={20} strokeWidth={2} />
                            </div>
                        </div>
                        {s.change !== null && s.change !== undefined && (
                            <div className="mt-3 flex items-center gap-2">
                                <span className={`text-xs flex items-center font-bold px-2 py-0.5 rounded-md border ${s.up ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'}`}>
                                    {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {Math.abs(s.change)}%
                                </span>
                                <span className="text-xs text-slate-400 font-medium">vs tháng trước</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* COURSE STATUS CARDS */}
            <div>
                <h2 className="text-lg font-bold text-slate-700 mb-4">Trạng thái khóa học</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {courseStatusCards.map((c, i) => (
                        <div key={i} className={`flex items-center gap-4 p-5 rounded-2xl border ${c.cls.split(' ').filter(x => x.startsWith('bg-') || x.startsWith('border-')).join(' ')}`}>
                            <div className={`p-3 rounded-xl ${c.cls}`}>
                                <c.Icon size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{c.label}</p>
                                <p className={`text-2xl font-extrabold mt-0.5 ${c.cls.split(' ').find(x => x.startsWith('text-'))}`}>{c.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CHARTS ROW 1 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Revenue Area Chart */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><DollarSign size={17} /></div>
                        <div>
                            <h2 className="font-bold text-slate-800 text-sm">Doanh thu theo tháng</h2>
                            <p className="text-xs text-slate-400 mt-0.5">6 tháng gần nhất</p>
                        </div>
                    </div>
                    <div className="p-6">
                        {(data.revenueByMonth || []).every(d => !d.revenue || d.revenue === 0) ? (
                            <div className="h-52 flex flex-col items-center justify-center text-slate-400 text-sm">
                                <BarChart2 size={36} className="mb-3 text-slate-200" /> Chưa có doanh thu
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={data.revenueByMonth} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="gradRev2" x1="0" y1="0" x2="0" y2="1">
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
                                        fill="url(#gradRev2)" dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Enrollment Bar Chart */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-violet-50 text-violet-600"><Users size={17} /></div>
                        <div>
                            <h2 className="font-bold text-slate-800 text-sm">Học viên ghi danh</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Số lượng mới mỗi tháng</p>
                        </div>
                    </div>
                    <div className="p-6">
                        {(data.enrollmentByMonth || []).every(d => !d.count) ? (
                            <div className="h-52 flex flex-col items-center justify-center text-slate-400 text-sm">
                                <Users size={36} className="mb-3 text-slate-200" /> Chưa có học viên
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={data.enrollmentByMonth} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip content={<CustomTooltip unit=" học viên" />} />
                                    <Bar dataKey="count" name="Học viên" fill="#a855f7" radius={[8, 8, 0, 0]} maxBarSize={44} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>

            {/* CHARTS ROW 2 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Top courses bar */}
                {topBarData.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><TrendingUp size={17} /></div>
                            <div>
                                <h2 className="font-bold text-slate-800 text-sm">Top khóa học (học viên)</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Xếp hạng theo lượt ghi danh</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={topBarData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} width={110} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="Học viên" fill="#3b82f6" radius={[0, 6, 6, 0]} maxBarSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Course status Pie */}
                {pieData.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-orange-50 text-orange-600"><BookOpen size={17} /></div>
                            <div>
                                <h2 className="font-bold text-slate-800 text-sm">Phân bố trạng thái khóa học</h2>
                                <p className="text-xs text-slate-400 mt-0.5">Tỉ lệ Approved / Pending / Draft / Rejected</p>
                            </div>
                        </div>
                        <div className="p-6 flex items-center justify-center gap-8">
                            <ResponsiveContainer width="50%" height={200}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                                        dataKey="value" paddingAngle={4} strokeWidth={0}>
                                        {pieData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(v, n) => [v, n]} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-3">
                                {pieData.map((d, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{d.value}</p>
                                            <p className="text-xs text-slate-400 font-medium">{d.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}
