import React, { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
    CheckCircle,
    Clock,
    XCircle,
    FileVideo,
    ChevronDown,
    ChevronUp,
    PlayCircle,
    FileText,
    HelpCircle,
    X,
    AlertTriangle,
    BookOpen,
    Filter,
    Search,
    Calendar,
    MoreHorizontal,
    User,
    Shield,
    CheckSquare,
    ExternalLink
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_MODERATION_QUEUE = [
    {
        id: 'REQ-001',
        type: 'COURSE',
        title: 'ReactJS Pro - Xây dựng E-commerce từ A-Z',
        author: 'Nguyễn Văn A',
        role: 'Senior Developer',
        avatar: 'NA',
        submittedDate: '20/05/2024',
        timeAgo: '2 giờ trước',
        category: 'Lập trình Web',
        desc: 'Khóa học chuyên sâu về React, Redux Toolkit và Next.js. Bao gồm 15 chương, 120 bài học.',
        itemsCount: 120,
        duration: '15h 30m',
        priority: 'HIGH'
    },
    {
        id: 'REQ-002',
        type: 'VIDEO',
        title: 'Hướng dẫn Deploy Docker lên AWS EC2',
        author: 'Trần Thị B',
        role: 'DevOps Engineer',
        avatar: 'TB',
        submittedDate: '20/05/2024',
        timeAgo: '5 giờ trước',
        category: 'DevOps',
        desc: 'Video hướng dẫn chi tiết cách deploy container lên cloud.',
        itemsCount: 1,
        duration: '45m',
        priority: 'MEDIUM'
    },
    {
        id: 'REQ-003',
        type: 'POST',
        title: '10 Nguyên tắc vàng trong thiết kế UX/UI',
        author: 'Lê C',
        role: 'Product Designer',
        avatar: 'LC',
        submittedDate: '19/05/2024',
        timeAgo: '1 ngày trước',
        category: 'Design',
        desc: 'Tổng hợp các quy luật Gestalt trong thiết kế giao diện người dùng hiện đại.',
        itemsCount: 1,
        duration: '10 phút đọc',
        priority: 'LOW'
    },
];

const MOCK_CONTENT_DETAIL = [
    {
        id: 1,
        title: "Chương 1: Khởi động dự án",
        items: [
            { id: 101, title: "1.1 Giới thiệu khóa học & Mục tiêu", type: "video", duration: "10:05", status: "ok" },
            { id: 102, title: "1.2 Cài đặt môi trường (Node, VSCode)", type: "video", duration: "15:20", status: "ok" },
            { id: 103, title: "1.3 Tài liệu tham khảo", type: "doc", size: "2.5 MB", status: "ok" },
        ]
    },
    {
        id: 2,
        title: "Chương 2: Kiến thức React cốt lõi",
        items: [
            { id: 201, title: "2.1 Components & Props là gì?", type: "video", duration: "25:10", status: "warning" },
            { id: 202, title: "2.2 State Management cơ bản", type: "video", duration: "30:00", status: "ok" },
            { id: 203, title: "2.3 Bài tập trắc nghiệm chương 2", type: "quiz", questions: 15, status: "ok" },
        ]
    }
];

export default function StaffModeration() {
    const [selectedItem, setSelectedItem] = useState(null);
    const [expandedSections, setExpandedSections] = useState({ 1: true, 2: true });
    
    // Logic Reject
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    // Filter & Search
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const quickReasons = [
        "Vi phạm bản quyền hình ảnh/âm thanh",
        "Chất lượng Video dưới chuẩn (720p)",
        "Tiêu đề giật tít, không đúng nội dung",
        "Thiếu tài liệu đính kèm bắt buộc",
        "Nội dung quảng cáo trái phép"
    ];

    // Filter Logic
    const filteredData = useMemo(() => {
        let data = MOCK_MODERATION_QUEUE;
        if (activeFilter !== 'ALL') data = data.filter(item => item.type === activeFilter);
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            data = data.filter(item => 
                item.title.toLowerCase().includes(query) || 
                item.author.toLowerCase().includes(query)
            );
        }
        return data;
    }, [activeFilter, searchQuery]);

    // Handlers
    const toggleSection = (id) => setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
    
    const openReviewModal = (item) => {
        setSelectedItem(item);
        setIsRejecting(false);
        setRejectReason("");
    };

    const handleApprove = () => {
        toast.success(`Đã duyệt thành công: ${selectedItem.title}`, {
            style: { background: '#10B981', color: '#fff' },
            iconTheme: { primary: '#fff', secondary: '#10B981' },
        });
        setSelectedItem(null);
    };

    const handleReject = () => {
        if (!rejectReason) return toast.error("Vui lòng nhập lý do từ chối");
        toast.error(`Đã từ chối: ${selectedItem.title}`);
        setSelectedItem(null);
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'COURSE': return <BookOpen size={18} />;
            case 'VIDEO': return <FileVideo size={18} />;
            case 'POST': return <FileText size={18} />;
            default: return <BookOpen size={18} />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'COURSE': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'VIDEO': return 'text-purple-600 bg-purple-50 border-purple-100';
            case 'POST': return 'text-orange-600 bg-orange-50 border-orange-100';
            default: return 'text-slate-600 bg-slate-50 border-slate-100';
        }
    };

    return (
        <div className="min-h-screen bg-transparent font-sans text-slate-800 pb-20">
            
            {/* --- 1. HEADER SECTION --- */}
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
                    <Shield className="text-indigo-600" size={28} />
                    Cổng Kiểm Duyệt Nội Dung
                </h1>
                <p className="text-slate-500 mt-2 font-medium">Xin chào Staff, hôm nay bạn có <span className="text-indigo-600 font-bold">3 nội dung</span> cần xử lý.</p>
            </div>

            {/* --- 2. STATS CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Chờ xử lý', val: '12', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
                    { label: 'Đã duyệt hôm nay', val: '24', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    { label: 'Bị từ chối', val: '05', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
                    { label: 'Hiệu suất tuần', val: '98%', icon: CheckSquare, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                ].map((stat, idx) => (
                    <div key={idx} className={`bg-white p-5 rounded-2xl border ${stat.border} shadow-sm hover:shadow-md transition-shadow flex items-center justify-between`}>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-extrabold text-slate-700 mt-1">{stat.val}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* --- 3. MAIN WORKSPACE --- */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                
                {/* Toolbar */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Filters */}
                    <div className="flex bg-slate-200/50 p-1 rounded-xl">
                        {[
                            { id: 'ALL', label: 'Tất cả' },
                            { id: 'COURSE', label: 'Khóa học' },
                            { id: 'VIDEO', label: 'Video' },
                            { id: 'POST', label: 'Bài viết' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveFilter(tab.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                    activeFilter === tab.id 
                                    ? 'bg-white text-indigo-600 shadow-sm' 
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-80">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm nội dung..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Content List (Modern Rows) */}
                <div className="divide-y divide-slate-50">
                    {filteredData.length > 0 ? filteredData.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => openReviewModal(item)}
                            className="group relative p-5 hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col md:flex-row gap-4 items-start md:items-center"
                        >
                            {/* Left Border Indicator */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${item.priority === 'HIGH' ? 'bg-amber-400' : 'bg-transparent group-hover:bg-indigo-400'}`}></div>

                            {/* Icon & Type */}
                            <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center border ${getTypeColor(item.type)}`}>
                                {getTypeIcon(item.type)}
                            </div>

                            {/* Main Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                                        #{item.id}
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 uppercase">
                                        {item.category}
                                    </span>
                                    {item.priority === 'HIGH' && (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-600 border border-amber-200 flex items-center gap-1">
                                            <AlertTriangle size={10} /> Ưu tiên
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><User size={12}/> {item.author}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Clock size={12}/> {item.timeAgo}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><BookOpen size={12}/> {item.itemsCount} bài học</span>
                                </div>
                            </div>

                            {/* Action Placeholder */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity px-4">
                                <button className="px-4 py-2 bg-white border border-indigo-200 text-indigo-600 text-sm font-bold rounded-lg shadow-sm hover:bg-indigo-50">
                                    Kiểm duyệt ngay
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="p-12 text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                <Search size={40} />
                            </div>
                            <p className="text-slate-500 font-medium">Không tìm thấy nội dung nào phù hợp.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- 4. REVIEW MODAL (SUPERCHARGED) --- */}
            {selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-6 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300 ring-1 ring-slate-900/5">
                        
                        {/* Modal Header */}
                        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between bg-white z-20 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${getTypeColor(selectedItem.type)}`}>
                                    {getTypeIcon(selectedItem.type)}
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-800 line-clamp-1 max-w-md">{selectedItem.title}</h2>
                                    <p className="text-xs text-slate-400">ID: {selectedItem.id} • Gửi lúc: {selectedItem.submittedDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                    <ExternalLink size={14}/> Xem trang gốc
                                </button>
                                <button onClick={() => setSelectedItem(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body: Split View */}
                        <div className="flex-1 flex overflow-hidden">
                            
                            {/* LEFT: Content Preview (70%) */}
                            <div className="flex-1 overflow-y-auto bg-slate-100 p-6 md:p-8">
                                <div className="max-w-3xl mx-auto space-y-6">
                                    {/* Video Player Placeholder */}
                                    <div className="aspect-video bg-black rounded-xl shadow-lg flex items-center justify-center relative group cursor-pointer overflow-hidden">
                                        <img src={`https://source.unsplash.com/random/800x450/?coding,computer`} alt="Thumbnail" className="w-full h-full object-cover opacity-60" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <PlayCircle size={64} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                        </div>
                                        <div className="absolute bottom-4 left-4 text-white text-sm font-bold bg-black/50 px-2 py-1 rounded">
                                            Preview: Bài 1.1 (10:05)
                                        </div>
                                    </div>

                                    {/* Course Structure */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Nội dung chi tiết</h3>
                                        </div>
                                        <div>
                                            {MOCK_CONTENT_DETAIL.map(section => (
                                                <div key={section.id} className="border-b border-slate-100 last:border-0">
                                                    <div 
                                                        onClick={() => toggleSection(section.id)}
                                                        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                                    >
                                                        <span className="text-sm font-bold text-slate-700">{section.title}</span>
                                                        {expandedSections[section.id] ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
                                                    </div>
                                                    
                                                    {expandedSections[section.id] && (
                                                        <div className="bg-slate-50/50 border-t border-slate-100">
                                                            {section.items.map(item => (
                                                                <div key={item.id} className="px-6 py-3 flex items-center justify-between hover:bg-white border-l-4 border-transparent hover:border-indigo-400 transition-all group">
                                                                    <div className="flex items-center gap-3">
                                                                        {item.type === 'video' ? <FileVideo size={16} className="text-slate-400"/> : <FileText size={16} className="text-slate-400"/>}
                                                                        <span className="text-sm text-slate-600">{item.title}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="text-xs text-slate-400">{item.duration || item.size}</span>
                                                                        {item.status === 'warning' && <AlertTriangle size={14} className="text-amber-500" />}
                                                                        <button className="text-xs font-bold text-indigo-600 opacity-0 group-hover:opacity-100">Xem</button>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Description */}
                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                        <h3 className="text-sm font-bold text-slate-700 mb-2">Mô tả khóa học</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">{selectedItem.desc}</p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT: Action Sidebar (30%) */}
                            <div className="w-96 bg-white border-l border-slate-200 flex flex-col z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
                                
                                {/* Author Info */}
                                <div className="p-5 border-b border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Thông tin tác giả</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                                            {selectedItem.avatar}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{selectedItem.author}</p>
                                            <p className="text-xs text-slate-500">{selectedItem.role}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <div className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded border border-emerald-100">Uy tín cao</div>
                                        <div className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-100">15 khóa học</div>
                                    </div>
                                </div>

                                {/* Review Checklist */}
                                <div className="flex-1 overflow-y-auto p-5">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Checklist kiểm duyệt</h4>
                                    <div className="space-y-2">
                                        {["Chất lượng Video (HD+)", "Âm thanh rõ ràng", "Tài liệu đầy đủ", "Không vi phạm bản quyền", "Giá bán hợp lý"].map((check, i) => (
                                            <label key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors">
                                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                                <span className="text-sm text-slate-600 font-medium">{check}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons Area */}
                                <div className="p-5 border-t border-slate-100 bg-slate-50">
                                    {!isRejecting ? (
                                        <div className="space-y-3">
                                            <button 
                                                onClick={handleApprove}
                                                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                                            >
                                                <CheckCircle size={20} /> Duyệt & Xuất bản
                                            </button>
                                            <button 
                                                onClick={() => setIsRejecting(true)}
                                                className="w-full py-3 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                            >
                                                <XCircle size={20} /> Từ chối / Yêu cầu sửa
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="animate-in slide-in-from-bottom-2">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-rose-600">Lý do từ chối:</span>
                                                <button onClick={() => setIsRejecting(false)} className="text-xs text-slate-400 hover:text-slate-600 underline">Quay lại</button>
                                            </div>
                                            <textarea 
                                                className="w-full text-sm p-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-100 outline-none bg-white mb-3"
                                                rows="3"
                                                placeholder="Nhập lý do hoặc chọn bên dưới..."
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                            ></textarea>
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {quickReasons.slice(0,3).map((r, i) => (
                                                    <button key={i} onClick={() => setRejectReason(r)} className="text-[10px] px-2 py-1 bg-white border border-slate-200 rounded hover:border-rose-300 hover:text-rose-600 transition-colors truncate max-w-full">
                                                        {r}
                                                    </button>
                                                ))}
                                            </div>
                                            <button 
                                                onClick={handleReject}
                                                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-md transition-all"
                                            >
                                                Gửi yêu cầu sửa
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}