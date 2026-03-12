import React, { useState, useMemo, useEffect } from 'react';
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

import { getAllCourses, verifyCourseAprroved, getCourseStats } from '@/services/courseService';
import CourseViewer from '../../components/ui/CourseViewer';


// --- HELPER FUNCTIONS ---
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
};

const calculateTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
};

export default function StaffModeration() {
    const [selectedItem, setSelectedItem] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});

    //phat video hoac noi dung
    const [activeLesson, setActiveLesson] = useState(null);

    // Logic Reject
    const [isRejecting, setIsRejecting] = useState(false);
    const [rejectReason, setRejectReason] = useState("");

    // Filter & Search
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const [allCourses, setAllCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [courseStats, setCourseStats] = useState({
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
        totalCount: 0
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    const quickReasons = [
        "Vi phạm bản quyền hình ảnh/âm thanh",
        "Chất lượng Video dưới chuẩn (720p)",
        "Tiêu đề giật tít, không đúng nội dung",
        "Thiếu tài liệu đính kèm bắt buộc",
        "Nội dung quảng cáo trái phép"
    ];

    const statusMap = {
        DRAFT: {
            label: 'Bản nháp',
            className: 'bg-gray-100 text-gray-600 border border-gray-200',
        },
        PENDING_APPROVAL: {
            label: 'Chờ duyệt',
            className: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
        },
        APPROVED: {
            label: 'Đã duyệt',
            className: 'bg-green-100 text-green-700 border border-green-200',
        },
        REJECTED: {
            label: 'Bị từ chối',
            className: 'bg-red-100 text-red-700 border border-red-200',
        },
    };

    const fetchStats = async () => {
        try {
            const res = await getCourseStats();
            if (res.data?.data) {
                setCourseStats(res.data.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải thống kê:", error);
        }
    };

    const fetchCourses = async (page = 1, search = searchQuery) => {
        setIsLoading(true);
        try {
            const response = await getAllCourses(page, pageSize, search);
            console.log("Staff Moderation API Response:", response.data);
            
            const pageData = response.data?.data;
            const content = pageData?.data || [];
            
            setAllCourses(content);
            setTotalPages(pageData?.totalPages || 0);
            setTotalElements(pageData?.totalElements || 0);
            setCurrentPage(pageData?.currentPage || page);

        } catch (error) {
            console.error("Lỗi khi lấy danh sách khóa học:", error);
            setAllCourses([]);
            setTotalPages(0);
            setTotalElements(0);
            toast.error("Không thể tải danh sách khóa học");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses(1);
        fetchStats();
    }, []);

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCourses(1, searchQuery);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // --- 2. DATA MAPPING (API -> UI) ---
    const mappedCourses = useMemo(() => {
        return allCourses.map(course => {
            // Calculate total lessons across all modules
            const totalLessons = course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;

            return {
                id: course.courseId,
                rawId: course.courseId, // Keep raw ID for API calls
                type: 'COURSE', // Your API seems to return only courses
                title: course.title,
                author: course.constructorName || 'Unknown Instructor',
                role: 'Instructor',
                avatar: (course.constructorName || 'U').charAt(0).toUpperCase(),
                submittedDate: formatDate(course.createdAt),
                timeAgo: calculateTimeAgo(course.createdAt),
                category: 'Tiếng Nhật', // Or derive from description/other fields if available
                desc: course.description,
                itemsCount: totalLessons,
                priority: course.status === 'PENDING_APPROVAL' ? 'HIGH' : 'MEDIUM',
                thumbnail: course.thumbnailUrl,
                price: course.price,
                status: course.status,
                modules: course.modules || [] // Pass modules for the modal
            };
        });
    }, [allCourses]);

    // --- 3. FILTERING ---
    const filteredData = useMemo(() => {
        let data = mappedCourses;

        // Filter by Type (Currently all are COURSE based on API, but logic remains)
        if (activeFilter !== 'ALL') {
            data = data.filter(item => item.type === activeFilter);
        }

        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            data = data.filter(item =>
                item.title.toLowerCase().includes(query) ||
                item.author.toLowerCase().includes(query)
            );
        }
        return data;
    }, [activeFilter, searchQuery, mappedCourses]);

    // Handlers
    const toggleSection = (moduleId) => {
        setExpandedSections(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    const openReviewModal = (item) => {
        setSelectedItem(item);
        setIsRejecting(false);
        setRejectReason("");

        // --- THÊM ĐOẠN NÀY ---
        // Tự động chọn bài học đầu tiên của module đầu tiên để phát
        if (item.modules && item.modules.length > 0 && item.modules[0].lessons?.length > 0) {
            setActiveLesson(item.modules[0].lessons[0]);
        } else {
            setActiveLesson(null);
        }

        // Reset expanded sections (giữ nguyên logic cũ của bạn)
        const initialExpanded = {};
        if (item.modules) {
            item.modules.forEach(mod => initialExpanded[mod.moduleId] = true);
        }
        setExpandedSections(initialExpanded);
    };

    const handleApprove = async () => {
        try {
            await verifyCourseAprroved(selectedItem.id, 'APPROVED');

            toast.success(`Đã duyệt thành công: ${selectedItem.title}`, {
                style: { background: '#10B981', color: '#fff' },
                iconTheme: { primary: '#fff', secondary: '#10B981' },
            });

            setSelectedItem(null);
            fetchCourses(currentPage); // Tải lại dữ liệu sau khi duyệt
            fetchStats(); // Tải lại thống kê
        } catch (error) {
            console.error(error);
            toast.error('Duyệt khóa học thất bại 😢');
        }
    };


    const handleReject = async () => {
        if (!rejectReason) return toast.error("Vui lòng nhập lý do từ chối");
        // TODO: Call API to reject course using selectedItem.rawId and rejectReason
        await verifyCourseAprroved(selectedItem.id, 'REJECTED', rejectReason);
        toast.error(`Đã từ chối: ${selectedItem.title}`);
        setSelectedItem(null);
        fetchCourses(currentPage); // Tải lại dữ liệu sau khi từ chối
        fetchStats(); // Tải lại thống kê
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
                <p className="text-slate-500 mt-2 font-medium">Xin chào Staff, hiện tại có <span className="text-indigo-600 font-bold">{courseStats.pendingCount} nội dung</span> cần xử lý.</p>
            </div>

            {/* --- 2. STATS CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
                {[
                    { label: 'Chờ xử lý', val: courseStats.pendingCount.toString(), icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
                    { label: 'Đã duyệt', val: courseStats.approvedCount.toString(), icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    { label: 'Bị từ chối', val: courseStats.rejectedCount.toString(), icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
                    { label: 'Tổng nội dung', val: courseStats.totalCount.toString(), icon: HelpCircle, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100' },
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
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeFilter === tab.id
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

                {/* Content List */}
                <div className="divide-y divide-slate-50">
                    {isLoading ? (
                        <div className="p-12 text-center text-slate-500">Đang tải dữ liệu...</div>
                    ) : filteredData.length > 0 ? filteredData.map((item) => (
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
                                        #{item.id.substring(0, 8)}...
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 uppercase">
                                        {item.category}
                                    </span>
                                    {statusMap[item.status] && (
                                        <span
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusMap[item.status].className}`}
                                        >
                                            {statusMap[item.status].label}
                                        </span>
                                    )}

                                </div>
                                <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><User size={12} /> {item.author}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Clock size={12} /> {item.timeAgo}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><BookOpen size={12} /> {item.itemsCount} bài học</span>
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

                {/* Pagination UI */}
                {totalPages > 1 && (
                    <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <p className="text-xs text-slate-500 font-medium">
                            Hiển thị từ <span className="text-slate-700 font-bold">{(currentPage - 1) * pageSize + 1}</span> đến <span className="text-slate-700 font-bold">{Math.min(currentPage * pageSize, totalElements)}</span> trên tổng số <span className="text-slate-700 font-bold">{totalElements}</span>
                        </p>
                        <div className="flex items-center gap-1">
                            <button 
                                onClick={() => fetchCourses(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                                <ChevronDown size={18} className="rotate-90" />
                            </button>
                            
                            {[...Array(totalPages)].map((_, i) => {
                                const pageNum = i + 1;
                                if (totalPages > 5) {
                                    if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                                        if (Math.abs(pageNum - currentPage) === 2) return <span key={i} className="px-1 text-slate-400">...</span>;
                                        return null;
                                    }
                                }
                                return (
                                    <button
                                        key={i}
                                        onClick={() => fetchCourses(pageNum)}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                            currentPage === pageNum 
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                                            : 'text-slate-500 hover:bg-white hover:shadow-sm'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button 
                                onClick={() => fetchCourses(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                                <ChevronUp size={18} className="rotate-90" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* --- 4. REVIEW MODAL --- */}
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
                                    <ExternalLink size={14} /> Xem trang gốc
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
                                    {/* Video Player Placeholder / Thumbnail */}
                                    {/* --- PHẦN PLAYER --- */}
                                    <div className="aspect-video bg-black rounded-xl shadow-lg flex items-center justify-center relative group overflow-hidden bg-slate-900">
                                        {activeLesson ? (
                                            activeLesson.videoUrl ? (
                                                // TRƯỜNG HỢP 1: Có Video -> Hiển thị Video Player
                                                <video
                                                    key={activeLesson.lessonId} // Key quan trọng để React reload video mới khi đổi bài
                                                    controls
                                                    autoPlay
                                                    className="w-full h-full object-contain"
                                                    src={activeLesson.videoUrl}
                                                >
                                                    Trình duyệt của bạn không hỗ trợ thẻ video.
                                                </video>
                                            ) : (
                                                // TRƯỜNG HỢP 2: Bài học dạng văn bản (không có video)
                                                <div className="text-center p-8">
                                                    <FileText size={48} className="text-slate-500 mx-auto mb-4" />
                                                    <h3 className="text-white font-bold text-lg mb-2">{activeLesson.title}</h3>
                                                    <p className="text-slate-400">Đây là bài học dạng văn bản/tài liệu.</p>
                                                    <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                                                        Đọc nội dung chi tiết bên dưới
                                                    </button>
                                                </div>
                                            )
                                        ) : (
                                            // TRƯỜNG HỢP 3: Chưa chọn bài nào hoặc khóa học chưa có bài
                                            <div className="flex flex-col items-center">
                                                <img
                                                    src={selectedItem.thumbnail || `https://source.unsplash.com/random/800x450/?coding`}
                                                    alt="Thumbnail"
                                                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                                                />
                                                <div className="z-10 flex flex-col items-center">
                                                    <PlayCircle size={64} className="text-white/80" />
                                                    <p className="text-white/80 mt-2 font-medium">Chọn bài học để xem</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Course Structure from API */}
                                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Nội dung chi tiết</h3>
                                        </div>
                                        <div>
                                            {selectedItem.modules && selectedItem.modules.length > 0 ? (
                                                selectedItem.modules.map(module => (
                                                    <div key={module.moduleId} className="border-b border-slate-100 last:border-0">
                                                        <div
                                                            onClick={() => toggleSection(module.moduleId)}
                                                            className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                                        >
                                                            <span className="text-sm font-bold text-slate-700">{module.title}</span>
                                                            {expandedSections[module.moduleId] ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                                                        </div>

                                                        {expandedSections[module.moduleId] && (
                                                            <div className="bg-slate-50/50 border-t border-slate-100">
                                                                {module.lessons && module.lessons.map(lesson => (
                                                                    <div key={lesson.lessonId} className="px-6 py-3 flex items-center justify-between hover:bg-white border-l-4 border-transparent hover:border-indigo-400 transition-all group">
                                                                        <div className="flex items-center gap-3">
                                                                            {lesson.videoUrl ? <FileVideo size={16} className="text-slate-400" /> : <FileText size={16} className="text-slate-400" />}
                                                                            <span className="text-sm text-slate-600">{lesson.title}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                            <span className="text-xs text-slate-400">
                                                                                {/* Placeholder for duration as API doesn't provide it yet */}
                                                                                --:--
                                                                            </span>
                                                                            <button
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation(); // Ngăn chặn sự kiện click đúp (nếu div cha cũng có onClick)
                                                                                    setActiveLesson(lesson);
                                                                                }}
                                                                                className={`text-xs font-bold ${activeLesson?.lessonId === lesson.lessonId ? 'text-indigo-600 opacity-100' : 'text-indigo-600 opacity-0 group-hover:opacity-100'}`}
                                                                            >
                                                                                {activeLesson?.lessonId === lesson.lessonId ? 'Đang xem' : 'Xem'}
                                                                            </button>                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {(!module.lessons || module.lessons.length === 0) && (
                                                                    <div className="px-6 py-3 text-xs text-slate-400 italic">Chưa có bài học nào</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-6 text-center text-slate-400 text-sm">Chưa có nội dung khóa học</div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                        <h3 className="text-sm font-bold text-slate-700 mb-2">Mô tả khóa học</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                            {selectedItem.desc || "Không có mô tả."}
                                        </p>
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
                                                {quickReasons.slice(0, 3).map((r, i) => (
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