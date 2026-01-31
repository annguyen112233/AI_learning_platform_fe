import React, { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
    Flag,
    MessageSquare,
    FileVideo,
    User,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock,
    Filter,
    MoreHorizontal,
    ShieldAlert,
    Search,
    Eye,
    Trash2,
    Ban
} from 'lucide-react';



// --- MOCK DATA: DANH SÁCH BÁO CÁO ---
const MOCK_REPORTS = [
    {
        id: 'RPT-001',
        targetType: 'COMMENT', // COMMENT, COURSE, USER
        targetContent: "Bài giảng này dở tệ, phí tiền, thầy giáo dạy như...", // Nội dung bị report
        targetLink: '/course/reactjs/lesson/12',
        reason: "Ngôn từ thù ghét / Xúc phạm",
        reporter: "nguyenvana_99",
        reportedUser: "phamthib_toxic",
        timestamp: "10 phút trước",
        status: "PENDING", // PENDING, RESOLVED, IGNORED
        priority: "HIGH" // HIGH, MEDIUM, LOW
    },
    {
        id: 'RPT-002',
        targetType: 'COURSE',
        targetContent: "Khóa học: Kiếm tiền online 100tr/tháng (Thầy Huấn)",
        targetLink: '/course/mmo-scam',
        reason: "Nội dung lừa đảo / Scam",
        reporter: "thanhniennghiem_tuc",
        reportedUser: "huan_rose",
        timestamp: "1 giờ trước",
        status: "PENDING",
        priority: "CRITICAL"
    },
    {
        id: 'RPT-003',
        targetType: 'VIDEO',
        targetContent: "Video bài 5: Cài đặt môi trường",
        targetLink: '/course/java/lesson/5',
        reason: "Video bị lỗi âm thanh / Màn hình đen",
        reporter: "hocvien_chamchi",
        reportedUser: "System",
        timestamp: "3 giờ trước",
        status: "PENDING",
        priority: "MEDIUM"
    },
    {
        id: 'RPT-004',
        targetType: 'COMMENT',
        targetContent: "Kết bạn Zalo 09xx để nhận tài liệu full nhé",
        targetLink: '/course/marketing/lesson/1',
        reason: "Spam / Quảng cáo trái phép",
        reporter: "admin_bot",
        reportedUser: "spam_account_123",
        timestamp: "5 giờ trước",
        status: "RESOLVED",
        priority: "LOW"
    }
];

export default function StaffReports() {
    const [activeTab, setActiveTab] = useState('PENDING'); // PENDING, RESOLVED
    const [selectedReport, setSelectedReport] = useState(null);
    const [processNote, setProcessNote] = useState("");

    const [allCourses, setAllCourses] = useState([]);

    

    // Filter Data
    const filteredReports = useMemo(() => {
        return MOCK_REPORTS.filter(r => r.status === activeTab);
    }, [activeTab]);

    // Helper: Get Icon & Color based on Type
    const getTypeConfig = (type) => {
        switch (type) {
            case 'COMMENT': return { icon: <MessageSquare size={16} />, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Bình luận' };
            case 'COURSE': return { icon: <FileVideo size={16} />, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Khóa học' };
            case 'USER': return { icon: <User size={16} />, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Người dùng' };
            default: return { icon: <AlertTriangle size={16} />, color: 'text-slate-600', bg: 'bg-slate-50', label: 'Khác' };
        }
    };

    // Helper: Priority Badge
    const PriorityBadge = ({ level }) => {
        const configs = {
            CRITICAL: "bg-rose-100 text-rose-700 border-rose-200",
            HIGH: "bg-orange-100 text-orange-700 border-orange-200",
            MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
            LOW: "bg-slate-100 text-slate-600 border-slate-200",
        };
        return (
            <span className={`text-[10px] px-2 py-0.5 rounded border font-bold uppercase tracking-wider ${configs[level] || configs.LOW}`}>
                {level}
            </span>
        );
    };

    // Actions
    const handleOpenDetail = (report) => {
        setSelectedReport(report);
        setProcessNote("");
    };

    const handleCloseDetail = () => setSelectedReport(null);

    const handleAction = (actionType) => {
        // Logic gọi API xử lý report ở đây
        toast.success(`Đã thực hiện: ${actionType} cho Ticket ${selectedReport.id}`);
        handleCloseDetail();
    };

    return (
        <div className="space-y-6 font-sans text-slate-800 animate-fade-in-up">

            {/* 1. HEADER & STATS */}
            <div className="flex flex-col md:flex-row justify-between gap-4 md:items-end">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
                        <Flag className="text-rose-600" size={28} /> Xử lý vi phạm
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Tiếp nhận và xử lý các báo cáo từ người dùng và hệ thống.</p>
                </div>

                <div className="flex gap-3">
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><AlertTriangle size={18} /></div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Chờ xử lý</p>
                            <p className="text-lg font-bold text-rose-600">03</p>
                        </div>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle size={18} /></div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Đã xong</p>
                            <p className="text-lg font-bold text-emerald-600">128</p>
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
                        {filteredReports.map((item) => {
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
                                                <p className="text-xs text-slate-400 mt-0.5">ID: {item.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        <span className="text-sm font-medium text-slate-700 bg-rose-50 text-rose-700 px-2 py-1 rounded border border-rose-100 inline-block mb-1">
                                            {item.reason}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                                            <Clock size={12} /> {item.timestamp}
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
                                            onClick={() => handleOpenDetail(item)}
                                            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                                        >
                                            Xử lý
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                        {filteredReports.length === 0 && (
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

            {/* 4. MODAL XỬ LÝ (DETAIL & ACTION) */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up">

                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-rose-100 text-rose-600`}>
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">Chi tiết vi phạm</h3>
                                    <p className="text-xs text-slate-500">Ticket ID: <span className="font-mono font-bold">{selectedReport.id}</span></p>
                                </div>
                            </div>
                            <PriorityBadge level={selectedReport.priority} />
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">

                            {/* Section: Bằng chứng (Nội dung bị report) */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Nội dung bị báo cáo</h4>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-700 italic relative group">
                                    <span className="absolute top-2 left-2 text-3xl text-slate-300 font-serif">"</span>
                                    <div className="relative z-10 pl-4">
                                        {selectedReport.targetContent}
                                    </div>
                                    {/* Link xem gốc */}
                                    <a href="#" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 mt-3 hover:underline">
                                        Xem nội dung gốc <Eye size={12} />
                                    </a>
                                </div>
                            </div>

                            {/* Section: Thông tin đối tượng */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg border border-slate-100 bg-white">
                                    <p className="text-xs text-slate-400">Người báo cáo</p>
                                    <p className="font-bold text-slate-700 flex items-center gap-2">
                                        <User size={14} /> {selectedReport.reporter}
                                    </p>
                                </div>
                                <div className="p-3 rounded-lg border border-rose-100 bg-rose-50/50">
                                    <p className="text-xs text-rose-400">Người bị báo cáo</p>
                                    <p className="font-bold text-rose-700 flex items-center gap-2">
                                        <User size={14} /> {selectedReport.reportedUser}
                                    </p>
                                </div>
                            </div>

                            {/* Section: Ghi chú xử lý */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1.5 block">Ghi chú xử lý (Tùy chọn)</label>
                                <textarea
                                    className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="Nhập lý do xóa bài hoặc ghi chú cho admin..."
                                    rows="2"
                                    value={processNote}
                                    onChange={(e) => setProcessNote(e.target.value)}
                                ></textarea>
                            </div>

                        </div>

                        {/* Modal Footer (Actions) */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={handleCloseDetail}
                                className="px-4 py-2 rounded-lg font-bold text-slate-500 hover:bg-white hover:text-slate-700 transition-colors"
                            >
                                Đóng
                            </button>

                            <button
                                onClick={() => handleAction('IGNORE')}
                                className="px-4 py-2 rounded-lg font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-colors flex items-center gap-2"
                            >
                                <XCircle size={18} /> Bỏ qua (Không vi phạm)
                            </button>

                            <button
                                onClick={() => handleAction('WARN')}
                                className="px-4 py-2 rounded-lg font-bold text-orange-600 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors flex items-center gap-2"
                            >
                                <AlertTriangle size={18} /> Cảnh báo User
                            </button>

                            <button
                                onClick={() => handleAction('DELETE')}
                                className="px-4 py-2 rounded-lg font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-200 transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={18} /> Xóa nội dung
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}