import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
    Users, Search, BookOpen, ChevronLeft, ChevronRight,
    Loader2, AlertTriangle, GraduationCap, Calendar
} from 'lucide-react';
import { getInstructorStudents } from '@/services/adminService';

const ITEMS_PER_PAGE = 8;
const Skeleton = ({ className = '' }) => <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />;

export default function InstructorStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const data = await getInstructorStudents();
                setStudents(data || []);
            } catch {
                setError('Không thể tải danh sách học viên.');
                toast.error('Lỗi tải học viên!');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = useMemo(() => students.filter(s =>
        s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase())
    ), [students, search]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    if (loading) return (
        <div className="space-y-6 font-sans">
            <div className="flex items-center gap-3 text-slate-500 font-semibold">
                <Loader2 size={18} className="animate-spin text-emerald-600" />
                <span>Đang tải học viên...</span>
            </div>
            <Skeleton className="h-14" />
            <Skeleton className="h-96" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertTriangle size={48} className="text-rose-300 mb-4" />
            <p className="text-slate-500">{error}</p>
            <button onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">Thử lại</button>
        </div>
    );

    return (
        <div className="space-y-6 font-sans text-slate-800">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Học viên của tôi</h1>
                    <p className="text-slate-500 mt-0.5 text-sm font-medium">{students.length} học viên đã ghi danh vào khóa học của bạn</p>
                </div>
                <div className="flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 font-bold px-4 py-2.5 rounded-xl text-sm">
                    <GraduationCap size={16} />
                    <span>{students.length} học viên</span>
                </div>
            </div>

            {/* SEARCH */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
                <div className="relative flex-1">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input type="text" placeholder="Tìm theo tên hoặc email học viên..."
                        value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 bg-slate-50" />
                </div>
                {search && (
                    <span className="text-sm text-slate-500 font-medium flex-shrink-0">
                        {filtered.length} kết quả
                    </span>
                )}
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                {['Học viên', 'Email', 'Số khóa học GD', 'Khóa đang học', 'Ngày mới nhất'].map(h => (
                                    <th key={h} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center">
                                        <GraduationCap size={40} className="mx-auto mb-3 text-slate-200" />
                                        <p className="text-slate-400 font-medium">Không tìm thấy học viên phù hợp</p>
                                    </td>
                                </tr>
                            ) : paginated.map(student => (
                                <tr key={student.userId} className="hover:bg-slate-50/60 transition-colors group">
                                    {/* Avatar + Name */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {student.imageUrl ? (
                                                <img src={student.imageUrl} alt={student.fullName}
                                                    className="w-10 h-10 rounded-full object-cover border-2 border-violet-200 shadow-sm flex-shrink-0" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-violet-100 border-2 border-violet-200 flex items-center justify-center text-violet-700 font-bold text-sm shadow-sm flex-shrink-0">
                                                    {student.fullName?.charAt(0)?.toUpperCase()}
                                                </div>
                                            )}
                                            <p className="font-bold text-slate-700 text-sm group-hover:text-emerald-700 transition-colors">{student.fullName}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{student.email}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-700 border border-violet-100 px-3 py-1 rounded-full text-xs font-bold">
                                            <BookOpen size={12} /> {student.enrolledCourseCount} khóa
                                        </span>
                                    </td>
                                    {/* Course list badges */}
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="flex flex-wrap gap-1.5">
                                            {(student.enrolledCourseTitles || []).slice(0, 2).map((title, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold line-clamp-1 max-w-[140px]" title={title}>
                                                    {title.length > 20 ? title.substring(0, 20) + '…' : title}
                                                </span>
                                            ))}
                                            {(student.enrolledCourseTitles?.length || 0) > 2 && (
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-xs font-semibold">
                                                    +{student.enrolledCourseTitles.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                            <Calendar size={13} className="text-slate-400" />
                                            {student.lastEnrolledAt || '—'}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <p className="text-sm text-slate-500 font-medium">
                            {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} / {filtered.length}
                        </p>
                        <div className="flex items-center gap-2">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${p === page ? 'bg-emerald-600 text-white shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-white'}`}>
                                    {p}
                                </button>
                            ))}
                            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
