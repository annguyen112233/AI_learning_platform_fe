import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
    BookOpen, Search, ChevronLeft, ChevronRight, CheckCircle,
    XCircle, Eye, Clock, Star, Users, Layers, X, Loader2, AlertTriangle
} from 'lucide-react';
import { getAdminCourses, verifyCourse } from '@/services/adminService';

const ITEMS_PER_PAGE = 6;

const statusConfig = {
    PENDING_APPROVAL: { label: 'Chờ duyệt', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', dot: 'bg-orange-500 animate-pulse' },
    APPROVED: { label: 'Đã duyệt', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', dot: 'bg-emerald-500' },
    REJECTED: { label: 'Từ chối', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', dot: 'bg-rose-500' },
    DRAFT: { label: 'Nháp', bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200', dot: 'bg-slate-400' },
};

// ─── Confirm Modal ────────────────────────────────────────────────────────────
const ConfirmModal = ({ course, action, reason, setReason, onConfirm, onCancel, loading }) => {
    const isApprove = action === 'APPROVED';
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-slate-100">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isApprove ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                        {isApprove ? <CheckCircle size={22} strokeWidth={2.5} /> : <XCircle size={22} strokeWidth={2.5} />}
                    </div>
                    <button onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{isApprove ? 'Phê duyệt khóa học?' : 'Từ chối khóa học?'}</h3>
                <p className="text-sm text-slate-500 mb-4">
                    <span className="font-bold text-slate-700">"{course.title}"</span>
                    {isApprove ? ' sẽ được công khai trên nền tảng.' : ' sẽ bị từ chối.'}
                </p>
                {!isApprove && (
                    <textarea
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        placeholder="Lý do từ chối (tùy chọn)..."
                        rows={3}
                        className="w-full mb-4 p-3 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-50 resize-none"
                    />
                )}
                <div className="flex gap-3">
                    <button onClick={onCancel} disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 disabled:opacity-50">
                        Hủy
                    </button>
                    <button onClick={onConfirm} disabled={loading}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-white font-bold transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 ${isApprove ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'}`}>
                        {loading && <Loader2 size={15} className="animate-spin" />}
                        {isApprove ? 'Phê duyệt' : 'Từ chối'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Skeleton = ({ className = '' }) => (
    <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CourseManagement() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatus] = useState('ALL');
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(null); // { course, action }
    const [reason, setReason] = useState('');
    const [verifying, setVerifying] = useState(false);

    // Fetch
    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const data = await getAdminCourses();
                setCourses(data || []);
            } catch (err) {
                setError('Không thể tải danh sách khóa học.');
                toast.error('Lỗi tải danh sách khóa học!');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    // Filter
    const filtered = useMemo(() => courses.filter(c => {
        const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase()) ||
            c.constructorName?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
        return matchSearch && matchStatus;
    }), [courses, search, statusFilter]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    // Counts for tabs
    const counts = {
        ALL: courses.length,
        PENDING_APPROVAL: courses.filter(c => c.status === 'PENDING_APPROVAL').length,
        APPROVED: courses.filter(c => c.status === 'APPROVED').length,
        REJECTED: courses.filter(c => c.status === 'REJECTED').length,
        DRAFT: courses.filter(c => c.status === 'DRAFT').length,
    };

    // Confirm
    const confirmAction = async () => {
        if (!modal) return;
        setVerifying(true);
        try {
            const updated = await verifyCourse(modal.course.courseId, modal.action, reason);
            setCourses(prev => prev.map(c => c.courseId === updated.courseId ? updated : c));
            toast[modal.action === 'APPROVED' ? 'success' : 'error'](
                modal.action === 'APPROVED'
                    ? `Đã duyệt: "${modal.course.title}"`
                    : `Đã từ chối: "${modal.course.title}"`
            );
            setModal(null);
            setReason('');
        } catch {
            toast.error('Có lỗi xảy ra, thử lại sau!');
        } finally {
            setVerifying(false);
        }
    };

    const tabs = [
        { key: 'ALL', label: 'Tất cả' },
        { key: 'PENDING_APPROVAL', label: 'Chờ duyệt' },
        { key: 'APPROVED', label: 'Đã duyệt' },
        { key: 'REJECTED', label: 'Từ chối' },
        { key: 'DRAFT', label: 'Nháp' },
    ].filter(t => counts[t.key] > 0 || t.key === 'ALL');

    if (loading) return (
        <div className="space-y-6 font-sans">
            <div className="flex items-center gap-3 text-slate-500 font-semibold">
                <Loader2 size={18} className="animate-spin text-green-600" />
                <span>Đang tải danh sách khóa học...</span>
            </div>
            <Skeleton className="h-14" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-52" />)}
            </div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center py-20 text-center font-sans">
            <AlertTriangle size={48} className="text-rose-300 mb-4" />
            <h2 className="text-xl font-bold text-slate-700 mb-2">Lỗi tải dữ liệu</h2>
            <p className="text-slate-500 text-sm">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700">Thử lại</button>
        </div>
    );

    return (
        <div className="space-y-6 font-sans text-slate-800">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Quản lý khóa học</h1>
                    <p className="text-slate-500 mt-1 text-sm font-medium">Dữ liệu thực từ database.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-orange-600 bg-orange-50 border border-orange-100 px-4 py-2.5 rounded-xl shadow-sm">
                    <Clock size={16} />
                    <span>{counts.PENDING_APPROVAL} chờ duyệt</span>
                </div>
            </div>

            {/* TABS + SEARCH */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-1.5 flex flex-wrap gap-2 items-center">
                {tabs.map(tab => {
                    const active = statusFilter === tab.key;
                    return (
                        <button key={tab.key} onClick={() => { setStatus(tab.key); setPage(1); }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${active ? 'bg-green-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>
                            {tab.label}
                            <span className={`px-1.5 py-0.5 rounded-md text-xs font-extrabold ${active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                {counts[tab.key]}
                            </span>
                        </button>
                    );
                })}
                <div className="flex-1" />
                <div className="relative min-w-[220px]">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input type="text" placeholder="Tìm khóa học, giảng viên..." value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-50 bg-slate-50" />
                </div>
            </div>

            {/* COURSE GRID */}
            {paginated.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 py-20 flex flex-col items-center text-slate-400">
                    <BookOpen size={48} className="mb-4 text-slate-200" />
                    <p className="font-semibold">Không có khóa học phù hợp</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {paginated.map(course => {
                        const sc = statusConfig[course.status] || statusConfig.DRAFT;
                        const thumb = course.title?.substring(0, 2).toUpperCase();
                        return (
                            <div key={course.courseId} className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 overflow-hidden group">
                                <div className="p-5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center text-green-700 font-black text-base border border-green-200 shadow-sm flex-shrink-0">
                                            {course.thumbnailUrl
                                                ? <img src={course.thumbnailUrl} className="w-full h-full object-cover rounded-xl" alt={course.title} />
                                                : thumb}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-green-700 transition-colors line-clamp-2">
                                                    {course.title}
                                                </h3>
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border flex-shrink-0 ${sc.bg} ${sc.text} ${sc.border}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                                                    {sc.label}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium mt-1">
                                                Giảng viên: <span className="font-bold text-slate-600">{course.constructorName}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                                        {course.jlptLevel && (
                                            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                                <Layers size={12} className="text-slate-400" /> {course.jlptLevel}
                                            </div>
                                        )}
                                        {course.modules && (
                                            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                                <BookOpen size={12} className="text-slate-400" /> {course.modules.length} module
                                            </div>
                                        )}
                                        <div className="ml-auto text-slate-400 text-xs">
                                            {course.createdAt ? new Date(course.createdAt).toLocaleDateString('vi-VN') : '—'}
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-50 bg-slate-50/60 px-5 py-3 flex items-center justify-between gap-3">
                                    <div className="text-sm font-bold text-slate-700">
                                        {course.price != null ? Number(course.price).toLocaleString('vi-VN') + '₫' : 'Miễn phí'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => toast(`Xem: ${course.title}`, { icon: '📖' })}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all">
                                            <Eye size={14} strokeWidth={2.5} /> Xem
                                        </button>
                                        {course.status !== 'APPROVED' && (
                                            <button onClick={() => { setModal({ course, action: 'APPROVED' }); setReason(''); }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-600 hover:text-white hover:bg-emerald-500 border border-emerald-200 hover:border-emerald-500 transition-all">
                                                <CheckCircle size={14} strokeWidth={2.5} /> Duyệt
                                            </button>
                                        )}
                                        {course.status !== 'REJECTED' && (
                                            <button onClick={() => { setModal({ course, action: 'REJECTED' }); setReason(''); }}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-500 hover:text-white hover:bg-rose-500 border border-rose-200 hover:border-rose-500 transition-all">
                                                <XCircle size={14} strokeWidth={2.5} /> Từ chối
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 px-6 py-4 shadow-sm">
                    <p className="text-sm text-slate-500 font-medium">
                        Trang <span className="font-bold text-slate-700">{page}</span> / {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                            <ChevronLeft size={16} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button key={p} onClick={() => setPage(p)}
                                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${p === page ? 'bg-green-600 text-white shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                {p}
                            </button>
                        ))}
                        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                            className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL */}
            {modal && (
                <ConfirmModal
                    course={modal.course}
                    action={modal.action}
                    reason={reason}
                    setReason={setReason}
                    onConfirm={confirmAction}
                    onCancel={() => setModal(null)}
                    loading={verifying}
                />
            )}
        </div>
    );
}
