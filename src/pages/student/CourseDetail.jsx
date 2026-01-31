import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Clock, BookOpen, Star, User, ArrowLeft,
    PlayCircle, Share2, Heart, AlertTriangle, Calendar, Info,
    ChevronDown, ChevronUp, FileText, Lock // <--- Thêm icon mới
} from 'lucide-react';
import toast from 'react-hot-toast';


// Import service
import { getCourseById } from '@/services/courseService';
import { enrollCourse } from '@/services/enrollmentService';

const formatDuration = (seconds) => {
    if (!seconds) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// --- 1. COMPONENT CON: Hiển thị từng Chương (Module) ---
// (Bạn có thể tách ra file riêng tên CourseModule.jsx sau này nếu muốn gọn code)
const CourseModule = ({ module, index, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-slate-200 last:border-0">
            {/* Header của Module - Click để đóng mở */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
                <div className="flex items-center gap-3">
                    {isOpen ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                    <span className="font-bold text-slate-800">
                        Chương {index + 1}: {module.title}
                    </span>
                </div>
                <span className="text-xs text-slate-500 font-medium hidden sm:block">
                    {module.lessons?.length || 0} bài học
                </span>
            </button>

            {/* Danh sách bài học (Lesson) - Chỉ hiện khi isOpen = true */}
            {isOpen && (
                <div className="bg-white">
                    {module.lessons?.map((lesson, lessonIdx) => (
                        <div
                            key={lesson.id || lessonIdx}
                            className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-emerald-50/30 transition-colors group cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                {/* Icon tùy loại bài học (Video hoặc Tài liệu) */}
                                {lesson.type === 'doc' ? (
                                    <FileText size={18} className="text-slate-400 group-hover:text-emerald-600" />
                                ) : (
                                    <PlayCircle size={18} className="text-slate-400 group-hover:text-emerald-600" />
                                )}

                                <span className="text-slate-600 text-sm font-medium group-hover:text-slate-900">
                                    {lesson.title}
                                </span>
                            </div>

                            {/* Thời lượng hoặc Trạng thái khóa */}
                            <div className="flex items-center gap-3">
                                {lesson.isPreview ? (
                                    <span className="text-[10px] text-emerald-600 font-bold border border-emerald-200 px-2 py-0.5 rounded bg-emerald-50 uppercase tracking-wide">
                                        Học thử
                                    </span>
                                ) : (
                                    <div className="flex items-center gap-1 text-slate-400">
                                        <span className="text-xs">{lesson.duration || "10:00"}</span>
                                        <Lock size={12} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Trường hợp chương trống */}
                    {(!module.lessons || module.lessons.length === 0) && (
                        <div className="p-4 text-xs text-slate-400 italic pl-11">
                            Nội dung chương này đang được cập nhật...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await getCourseById(id);
                const apiData = response.data.data || {};

                // --- XỬ LÝ DỮ LIỆU TỪ BACKEND ---
                const rawModules = apiData.modules || [];

                // Map dữ liệu từ Backend sang cấu trúc Frontend cần
                const mappedModules = rawModules.map(mod => ({
                    id: mod.moduleId,       // Backend trả về moduleId
                    title: mod.title,
                    lessons: (mod.lessons || []).map(les => ({
                        id: les.lessonId,     // Backend trả về lessonId
                        title: les.title,
                        // Xử lý thời lượng:
                        duration: formatDuration(les.duration),
                        // Xử lý loại bài học: Có videoUrl là 'video', không thì là 'doc'
                        type: les.videoUrl ? 'video' : 'doc',
                        // Backend chưa có trường isPreview, tạm thời để false (hoặc true cho bài đầu tiên)
                        isPreview: false
                    }))
                }));

                // Tính tổng số bài học thật
                const totalLessons = mappedModules.reduce((acc, m) => acc + m.lessons.length, 0);

                // Tính tổng thời lượng (Format lại tổng giây thành giờ phút nếu muốn)
                // Hiện tại Backend chưa trả về tổng duration của cả khóa, ta lấy tạm string 'Đang cập nhật' hoặc tính tổng
                const totalDurationSeconds = rawModules.reduce((acc, m) =>
                    acc + (m.lessons || []).reduce((sum, l) => sum + (l.duration || 0), 0)
                    , 0);

                // Hàm phụ để format tổng thời gian (VD: 4500s -> 1h 15p)
                const formatTotalDuration = (secs) => {
                    if (!secs) return "Chưa cập nhật";
                    const h = Math.floor(secs / 3600);
                    const m = Math.floor((secs % 3600) / 60);
                    if (h > 0) return `${h} giờ ${m} phút`;
                    return `${m} phút`;
                };

                const safeData = {
                    id: apiData.courseId,
                    title: apiData.title || "Chưa có tiêu đề",
                    description: apiData.description || "Chưa có mô tả",
                    price: apiData.price ?? 0,
                    status: apiData.status,
                    thumbnail: apiData.thumbnailUrl || "https://placehold.co/600x400?text=No+Image",
                    instructor: apiData.constructorName || "Unknown Instructor",
                    rejectionReason: apiData.rejectionReason,
                    createdAt: apiData.createdAt,

                    // --- GÁN DỮ LIỆU THẬT ---
                    modules: mappedModules,

                    rating: 0,
                    reviews: 0,
                    students: apiData.students || 0, // Backend chưa trả field này thì mặc định 0

                    // Sử dụng thời gian thực tính toán được
                    duration: formatTotalDuration(totalDurationSeconds),
                    lectures: totalLessons
                };

                setCourse(safeData);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi tải khóa học", error);
                toast.error("Không thể tải thông tin khóa học");
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const handleEnroll = async () => {
        setEnrolling(true);
        try {
            await enrollCourse(id);

            toast.success("Đăng ký thành công! Đang chuyển vào lớp học...");

            setTimeout(() => {
                navigate(`/student/learning/${id}`);
            }, 800);

        } catch (error) {
            toast.error(error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại");
            setEnrolling(false);
        }
    };


    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Đang tải dữ liệu...</p>
            </div>
        </div>
    );

    if (!course) return <div className="p-10 text-center text-slate-500">Không tìm thấy khóa học</div>;

    const createdDate = course.createdAt
        ? new Date(course.createdAt).toLocaleDateString('vi-VN')
        : 'N/A';

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20 text-slate-600">

            <div className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-medium transition-colors"
                >
                    <ArrowLeft size={20} /> Quay lại
                </button>

                {/* Hiển thị trạng thái Draft nếu có */}
                {course.status === 'DRAFT' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
                        <AlertTriangle size={14} /> BẢN NHÁP
                    </div>
                )}
            </div>

            {/* Cảnh báo từ chối */}
            {course.rejectionReason && (
                <div className="max-w-7xl mx-auto px-6 mt-6">
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
                        <Info className="shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold">Khóa học cần chỉnh sửa lại</h4>
                            <p className="text-sm mt-1">Lý do: {course.rejectionReason}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">

                {/* === LEFT COLUMN: MAIN INFO === */}
                <div className="lg:col-span-2 space-y-8">

                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                            {course.title}
                        </h1>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            {course.description}
                        </p>
                    </div>

                    {/* Instructor Info */}
                    <div className="flex flex-wrap items-center gap-6 pb-6 border-b border-slate-200">
                        <div className="flex items-center gap-3">
                            <img
                                src={`https://ui-avatars.com/api/?name=${course.instructor}&background=10b981&color=fff`}
                                alt="Instructor"
                                className="w-12 h-12 rounded-full border border-slate-200"
                            />
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">Giảng viên</p>
                                <p className="text-slate-900 font-bold">{course.instructor}</p>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
                        <div className="flex items-center gap-2 text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                            <Calendar size={18} className="text-emerald-600" />
                            <span className="text-sm font-medium">Tạo ngày: {createdDate}</span>
                        </div>
                    </div>

                    {/* --- 3. KHU VỰC HIỂN THỊ NỘI DUNG KHÓA HỌC (ĐÃ THAY THẾ PLACEHOLDER) --- */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        {/* Header của danh sách */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Nội dung khóa học</h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    <strong>{course.lectures}</strong> bài học • Thời lượng <strong>{course.duration}</strong>
                                </p>
                            </div>
                            <button className="text-sm font-bold text-emerald-600 hover:underline">
                                Mở rộng tất cả
                            </button>
                        </div>

                        {/* Render từng Module */}
                        <div>
                            {course.modules && course.modules.length > 0 ? (
                                course.modules.map((module, index) => (
                                    <CourseModule
                                        key={module.id || index}
                                        module={module}
                                        index={index}
                                        defaultOpen={index === 0} // Mặc định mở chương đầu tiên
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                        <BookOpen size={32} className="text-slate-400" />
                                    </div>
                                    <p className="text-slate-500 font-medium">Nội dung đang được cập nhật...</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* === RIGHT COLUMN: STICKY CARD === */}
                <div className="relative">
                    <div className="sticky top-24 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden">

                        {/* Thumbnail */}
                        <div className="relative aspect-video bg-slate-200">
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                <div className="bg-white/90 p-3 rounded-full shadow-lg">
                                    <PlayCircle size={32} className="text-emerald-600 ml-1" />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Price */}
                            <div>
                                <p className="text-sm text-slate-500 font-medium mb-1">Học phí</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-extrabold text-slate-900">
                                        {course.price === 0 ? "Miễn phí" : `${course.price.toLocaleString('vi-VN')} đ`}
                                    </span>
                                    {course.price === 0 && <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">FREE</span>}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleEnroll}
                                    disabled={enrolling} // ❌ bỏ check DRAFT
                                    className="w-full py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2
      bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200
      disabled:bg-slate-400 disabled:cursor-not-allowed
    "
                                >
                                    {enrolling ? "Đang xử lý..." : "Đăng ký ngay"}
                                </button>

                                {/* ⚠️ Chỉ hiển thị cảnh báo nếu là DRAFT */}
                                {course.status === 'DRAFT' && (
                                    <p className="text-xs text-amber-600 text-center">
                                        ⚠ Khóa học đang trong giai đoạn hoàn thiện, nội dung có thể thay đổi
                                    </p>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <button className="py-2.5 rounded-xl font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2 text-sm">
                                        <Heart size={16} /> Lưu tin
                                    </button>
                                    <button className="py-2.5 rounded-xl font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2 text-sm">
                                        <Share2 size={16} /> Chia sẻ
                                    </button>
                                </div>
                            </div>


                            {/* Features (Đã dùng số liệu từ Mock Data) */}
                            <div className="space-y-3 pt-4 border-t border-slate-100 text-sm text-slate-600">
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-2"><Clock size={16} className="text-slate-400" /> Thời lượng</span>
                                    <span className="font-semibold">{course.duration}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-2"><BookOpen size={16} className="text-slate-400" /> Bài giảng</span>
                                    <span className="font-semibold">{course.lectures} bài</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-2"><User size={16} className="text-slate-400" /> Học viên</span>
                                    <span className="font-semibold">{course.students}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}