import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    Flag, MessageSquare, FileVideo, User, AlertTriangle, CheckCircle,
    XCircle, Clock, ShieldAlert, Search, Eye, Trash2
} from 'lucide-react';
import { getReports, processReport } from '@/services/reportService';

export default function StaffReports() {
    const [activeTab, setActiveTab] = useState('PENDING');
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [processNote, setProcessNote] = useState('');
    const [search, setSearch] = useState('');
    const [stats, setStats] = useState({ pending: 0, resolved: 0 });

    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getReports(activeTab, search);
            const data = res.data?.data;
            setReports(Array.isArray(data?.data) ? data.data : []);
            if (activeTab === 'PENDING') {
                setStats(s => ({ ...s, pending: data?.totalElements ?? 0 }));
            } else {
                setStats(s => ({ ...s, resolved: data?.totalElements ?? 0 }));
            }
        } catch (err) {
            console.error('Error fetching reports:', err);
            setReports([]);
        } finally {
            setLoading(false);
        }
    }, [activeTab, search]);

    useEffect(() => { fetchReports(); }, [fetchReports]);

    const getTypeConfig = (type) => {
        const t = (type || '').toUpperCase();
        if (t === 'BÌNH LUẬN' || t === 'COMMENT') return { icon: <MessageSquare size={16} />, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Bình luận' };
        if (t === 'KHÓA HỌC' || t === 'COURSE') return { icon: <FileVideo size={16} />, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Khóa học' };
        if (t === 'NGƯỜI DÙNG' || t === 'USER') return { icon: <User size={16} />, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Người dùng' };
        return { icon: <AlertTriangle size={16} />, color: 'text-slate-600', bg: 'bg-slate-50', label: 'Khác' };
    };

    const PriorityBadge = ({ level }) => {
        const configs = {
            CRITICAL: 'bg-rose-100 text-rose-700 border-rose-200',
            HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
            MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            LOW: 'bg-slate-100 text-slate-600 border-slate-200',
        };
        return (
            <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${configs[level] || configs.LOW}`}>
                {level}
            </span>
        );
    };

    const handleAction = async (actionType) => {
        if (!selectedReport) return;
        try {
            await processReport(selectedReport.id, actionType, processNote);
            toast.success(`Đã xử lý báo cáo`);
            setSelectedReport(null);
            fetchReports();
        } catch (err) {
            toast.error('Xử lý thất bại, vui lòng thử lại!');
        }
    };

    const formatTime = (ts) => {
        if (!ts) return '';
        try {
            const d = new Date(ts);
            return d.toLocaleString('vi-VN');
        } catch { return ts; }
    };

    return (
        <div className="space-y-6 font-sans text-slate-800 animate-fade-in-up">

            {/* 1. HEADER & STATS */}
            <div className="flex flex-col md:flex-row justify-between gap-6 md:items-center">
                <div className="animate-fade-in">
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
                            <Flag size={24} />
                        </div>
                        Xử lý vi phạm
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 max-w-lg">
                        Hệ thống tiếp nhận báo cáo từ người dùng. Vui lòng xem xét kỹ lưỡng trước khi đưa ra quyết định xử lý.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-4 hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-black"><AlertTriangle size={24} /></div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Chờ xử lý</p>
                            <p className="text-2xl font-black text-rose-600 leading-none mt-1">{String(stats.pending).padStart(2, '0')}</p>
                        </div>
                    </div>
                    <div className="bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-4 hover:shadow-md transition-all">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-black"><CheckCircle size={24} /></div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Đã giải quyết</p>
                            <p className="text-2xl font-black text-emerald-600 leading-none mt-1">{String(stats.resolved).padStart(2, '0')}</p>
                        </div>
                    </div>
                </div>
            </div>


            {/* 2. FILTERS & SEARCH */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex bg-slate-100/80 p-1 rounded-lg w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('PENDING')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'PENDING' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Chờ xử lý
                    </button>
                    <button
                        onClick={() => setActiveTab('RESOLVED')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'RESOLVED' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Lịch sử
                    </button>
                </div>
                <div className="relative w-full md:w-80">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo ID, người báo cáo..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border-none bg-slate-50 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                </div>
            </div>

            {/* 3. REPORT LIST TABLE */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="p-4 pl-6">Đối tượng</th>
                            <th className="p-4">Lý do báo cáo</th>
                            <th className="p-4">Người báo cáo</th>
                            <th className="p-4">Mức độ</th>
                            <th className="p-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading && (
                            <tr><td colSpan="5" className="p-8 text-center text-slate-400">Đang tải...</td></tr>
                        )}
                        {!loading && reports.map((item) => {
                            const typeCfg = getTypeConfig(item.targetType);
                            return (
                                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-1 p-2 rounded-lg ${typeCfg.bg} ${typeCfg.color}`}>
                                                {typeCfg.icon}
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{typeCfg.label}</span>
                                                <p className="font-bold text-sm text-slate-700 line-clamp-1 max-w-[200px]" title={item.targetContent}>
                                                    "{item.targetContent}"
                                                </p>
                                                <p className="text-xs text-slate-400 mt-0.5 font-mono">ID: {String(item.id).substring(0, 8)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <span className="text-sm font-medium text-slate-700 bg-rose-50 text-rose-700 px-2 py-1 rounded border border-rose-100 inline-block mb-1">
                                            {item.reason}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                                            <Clock size={12} /> {formatTime(item.timestamp)}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="text-sm font-bold text-slate-700">{item.reporter}</div>
                                        <div className="text-xs text-slate-400">tố cáo <span className="text-rose-500 font-bold">{item.reportedUser}</span></div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <PriorityBadge level={item.priority} />
                                    </td>
                                    <td className="p-4 text-center align-middle">
                                        <button
                                            onClick={() => { setSelectedReport(item); setProcessNote(''); }}
                                            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                                        >
                                            Xử lý
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {!loading && reports.length === 0 && (
                            <tr>
                                <td colSpan="5" className="p-12 text-center text-slate-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <ShieldAlert size={48} className="text-slate-200" />
                                        <p>Không có báo cáo nào ở trạng thái này.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 4. MODAL XỬ LÝ */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-rose-100 text-rose-600"><AlertTriangle size={20} /></div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">Chi tiết vi phạm</h3>
                                    <p className="text-xs text-slate-500">Ticket ID: <span className="font-mono font-bold">{String(selectedReport.id).substring(0, 8)}...</span></p>
                                </div>
                            </div>
                            <PriorityBadge level={selectedReport.priority} />
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Nội dung bị báo cáo</h4>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 italic relative">
                                    <span className="absolute top-2 left-2 text-3xl text-slate-300 font-serif">"</span>
                                    <div className="relative z-10 pl-4">{selectedReport.targetContent}</div>
                                    <Link to={selectedReport.targetLink || '#'} className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 mt-3 hover:underline">
                                        Xem nội dung gốc <Eye size={12} />
                                    </Link>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg border border-slate-100 bg-white">
                                    <p className="text-xs text-slate-400">Người báo cáo</p>
                                    <p className="font-bold text-slate-700 flex items-center gap-2"><User size={14} /> {selectedReport.reporter}</p>
                                </div>
                                <div className="p-3 rounded-lg border border-rose-100 bg-rose-50/50">
                                    <p className="text-xs text-rose-400">Người bị báo cáo</p>
                                    <p className="font-bold text-rose-700 flex items-center gap-2"><User size={14} /> {selectedReport.reportedUser}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Ghi chú xử lý (Tùy chọn)</label>
                                <textarea
                                    className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="Nhập lý do xóa bài hoặc ghi chú..."
                                    rows="2"
                                    value={processNote}
                                    onChange={(e) => setProcessNote(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button onClick={() => setSelectedReport(null)} className="px-4 py-2 rounded-lg font-bold text-slate-500 hover:bg-white hover:text-slate-700 transition-colors">
                                Đóng
                            </button>
                            <button onClick={() => handleAction('IGNORE')} className="px-4 py-2 rounded-lg font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-2">
                                <XCircle size={18} /> Bỏ qua
                            </button>
                            <button onClick={() => handleAction('WARN')} className="px-4 py-2 rounded-lg font-bold text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors flex items-center gap-2">
                                <AlertTriangle size={18} /> Cảnh báo User
                            </button>
                            <button onClick={() => handleAction('DELETE')} className="px-4 py-2 rounded-lg font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition-colors flex items-center gap-2">
                                <Trash2 size={18} /> Xóa nội dung
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}