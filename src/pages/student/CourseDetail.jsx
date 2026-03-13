import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
    Clock, BookOpen, Star, User, ArrowLeft,
    PlayCircle, Share2, Heart, AlertTriangle, Calendar, Info,
    ChevronDown, ChevronUp, FileText, Lock, CreditCard, CheckCircle // <--- Thêm icon mới
} from 'lucide-react';
import toast from 'react-hot-toast';

// Import service
import { getCourseById } from '@/services/courseService';
import { enrollCourse } from '@/services/enrollmentService';
import { createPaymentVnpay, createPaymentMomo } from '@/services/paymentService';

const formatDuration = (seconds) => {
    if (!seconds) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// --- COMPONENT CON: Hiển thị từng Chương (Giữ nguyên) ---
const CourseModule = ({ module, index, isEnrolled, onLessonClick, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-slate-200 last:border-0">
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

            {isOpen && (
                <div className="bg-white">
                    {module.lessons?.map((lesson, lessonIdx) => (
                        <div
                            key={lesson.id || lessonIdx}
                            onClick={() => (isEnrolled || lesson.isPreview) && onLessonClick(lesson)}
                            className={`flex items-center justify-between p-4 border-b border-slate-50 hover:bg-emerald-50/30 transition-colors group ${
                                (isEnrolled || lesson.isPreview) ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {lesson.type === 'doc' ? (
                                    <FileText size={18} className="text-slate-400 group-hover:text-emerald-600" />
                                ) : (
                                    <PlayCircle size={18} className="text-slate-400 group-hover:text-emerald-600" />
                                )}
                                <span className={`text-sm font-medium ${
                                    (isEnrolled || lesson.isPreview) ? 'text-slate-600 group-hover:text-slate-900' : 'text-slate-400'
                                }`}>
                                    {lesson.title}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                {lesson.isPreview ? (
                                    <span className="text-[10px] text-emerald-600 font-bold border border-emerald-200 px-2 py-0.5 rounded bg-emerald-50 uppercase tracking-wide">
                                        Học thử
                                    </span>
                                ) : isEnrolled ? (
                                    <span className="text-xs text-slate-400">{lesson.duration || "10:00"}</span>
                                ) : (
                                    <div className="flex items-center gap-1 text-slate-400">
                                        <span className="text-xs">{lesson.duration || "10:00"}</span>
                                        <Lock size={12} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
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

const [subscription, setSubscription] = useState(null);


    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    // --- STATE CHO MODAL THANH TOÁN ---
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [enrollStep, setEnrollStep] = useState(1); // 1: Chọn loại, 2: Chọn thanh toán
    const [paymentMethod, setPaymentMethod] = useState('VNPAY'); // 'MOMO' | 'VNPAY'

   useEffect(() => {
    const sub = sessionStorage.getItem("subscription");

    if (sub) {
        setSubscription(JSON.parse(sub));
    }
}, []);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await getCourseById(id);
                const apiData = response.data.data || {};
                const rawModules = apiData.modules || [];

                const mappedModules = rawModules.map(mod => ({
                    id: mod.moduleId,
                    title: mod.title,
                    lessons: (mod.lessons || []).map(les => ({
                        id: les.lessonId,
                        title: les.title,
                        duration: formatDuration(les.duration),
                        type: les.videoUrl ? 'video' : 'doc',
                        isPreview: false
                    }))
                }));

                const totalLessons = mappedModules.reduce((acc, m) => acc + m.lessons.length, 0);
                const totalDurationSeconds = rawModules.reduce((acc, m) =>
                    acc + (m.lessons || []).reduce((sum, l) => sum + (l.duration || 0), 0)
                    , 0);

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
                    modules: mappedModules,
                    enrolled: apiData.enrolled === true, // strict: chỉ true nếu backend trả về true
                    rating: 0,
                    reviews: 0,
                    students: apiData.students || 0,
                    duration: formatTotalDuration(totalDurationSeconds),
                    lectures: totalLessons
                };

                setCourse(safeData);
                setLoading(false);

                console.log("API detail:", apiData);
                console.log("enrolled detail:", apiData.enrolled);
            } catch (error) {
                console.error("Lỗi tải khóa học", error);
                toast.error("Không thể tải thông tin khóa học");
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    // --- XỬ LÝ KHI NGƯỜI DÙNG CHỌN LOẠI ĐĂNG KÝ ---
    const handleSelectEnrollType = (type) => {
        if (type === 'SUBSCRIPTION') {

            if (!subscription || subscription.active !== "ACTIVE") {
            navigate('/student/profile?tab=upgrade');
            return;
        }

            handleEnrollBySubscription();
        } else if (type === 'SINGLE_PURCHASE') {
            // Trường hợp 2: Mua lẻ -> Chuyển sang bước chọn thanh toán
            setEnrollStep(2);
        }
    };

    const handleEnrollBySubscription = async () => {
        try {
            setEnrolling(true);
            const type = 'SUBSCRIPTION';

            await enrollCourse({courseId: course.id, type});

            toast.success("Đăng ký khóa học thành công!");

            setCourse(prev => ({
                ...prev,
                enrolled: true
            }));

            setShowEnrollModal(false);

        } catch (error) {
            toast.error("Không thể đăng ký khóa học");
        } finally {
            setEnrolling(false);
        }
    };

    // --- XỬ LÝ THANH TOÁN (MUA LẺ) ---
    const handlePayment = async () => {
        // 1. Kiểm tra đầu vào
        if (!paymentMethod) {
            toast.error("Vui lòng chọn phương thức thanh toán");
            return;
        }

        setEnrolling(true);

        try {
            let response;

            // Chuẩn bị 3 tham số theo đúng thứ tự hàm service yêu cầu
            // Tham số 1: Ở đây là ID khóa học (tương ứng vị trí subscriptionPlan)
            const subscriptionPlan = "COURSE";
            // Tham số 2: Giá tiền
            const amount = course.price;
            const courseId = course.id

            // Tham số 3: Nội dung thanh toán
            // Lưu ý: Nội dung nên viết không dấu để tránh lỗi ở cổng thanh toán
            const orderInfo = `Thanh toan khoa hoc ${course.title}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            // 2. Gọi API tương ứng với 3 tham số
            if (paymentMethod === 'VNPAY') {
                // Gọi API VNPAY (truyền 3 tham số rời)
                response = await createPaymentVnpay(subscriptionPlan, amount, orderInfo, courseId);
            } else if (paymentMethod === 'MOMO') {
                // Gọi API MOMO (truyền 3 tham số rời)
                response = await createPaymentMomo(subscriptionPlan, amount, orderInfo, courseId);
            }

            // 3. Trích xuất Link thanh toán
            const payUrl =
                response?.data?.payUrl ||
                response?.data?.paymentUrl ||
                response?.data?.data?.payUrl ||
                response?.payUrl;

            // 4. Validate Link
            if (!payUrl) {
                console.error("Lỗi: Không lấy được link thanh toán", response);
                toast.error("Hệ thống không trả về link thanh toán. Vui lòng thử lại!");
                setEnrolling(false);
                return;
            }

            // 5. Redirect sang cổng thanh toán
            toast.success(`Đang chuyển sang cổng thanh toán ${paymentMethod}...`);
            window.location.href = payUrl;

        } catch (error) {
            console.error("Payment Error:", error);
            const errorMessage = error.response?.data?.message || "Khởi tạo thanh toán thất bại";
            toast.error(errorMessage);
            setEnrolling(false);
        }
    };

    // Reset modal khi đóng
    const closeEnrollModal = () => {
        setShowEnrollModal(false);
        setEnrollStep(1);
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
                {course.status === 'DRAFT' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
                        <AlertTriangle size={14} /> BẢN NHÁP
                    </div>
                )}
            </div>

            {/* Error / Rejection Alert */}
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
                {/* === LEFT COLUMN === */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                            {course.title}
                        </h1>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            {course.description}
                        </p>
                    </div>

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

                    {/* Course Content */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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

                        <div>
                            {course.modules && course.modules.length > 0 ? (
                                course.modules.map((module, index) => (
                                    <CourseModule
                                        key={module.id || index}
                                        module={module}
                                        index={index}
                                        isEnrolled={course.enrolled}
                                        onLessonClick={() => navigate(`/student/learning/${course.id}`)}
                                        defaultOpen={index === 0}
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
                        <div className="relative aspect-video bg-slate-200">
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                <div className="bg-white/90 p-3 rounded-full shadow-lg">
                                    <PlayCircle size={32} className="text-emerald-600 ml-1" />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <p className="text-sm text-slate-500 font-medium mb-1">Học phí</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-extrabold text-slate-900">
                                        {course.price === 0 ? "Miễn phí" : `${course.price.toLocaleString('vi-VN')} đ`}
                                    </span>
                                    {course.price === 0 && <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">FREE</span>}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {course.enrolled ? (
                                    <button
                                        onClick={() => navigate(`/student/learning/${id}`)}
                                        className="w-full py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                                    >
                                        <PlayCircle size={18} /> VÀO HỌC NGAY
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setShowEnrollModal(true)}
                                        className="w-full py-3.5 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2
        bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                                    >
                                        Đăng ký ngay
                                    </button>
                                )}

                                {course.status === 'DRAFT' && (
                                    <p className="text-xs text-amber-600 text-center">
                                        ⚠ Khóa học đang trong giai đoạn hoàn thiện
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

                            {/* --- MODAL ĐĂNG KÝ MỚI --- */}
                            {showEnrollModal && (
                                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all">
                                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all scale-100">

                                        {/* HEADER MODAL */}
                                        <div className="flex items-center justify-between mb-5">
                                            <h3 className="text-xl font-bold text-slate-900">
                                                {enrollStep === 1 ? 'Chọn cách đăng ký' : 'Thanh toán khóa học'}
                                            </h3>
                                            {enrollStep === 2 && (
                                                <button onClick={() => setEnrollStep(1)} className="text-sm text-slate-500 hover:text-emerald-600 font-medium">
                                                    Quay lại
                                                </button>
                                            )}
                                        </div>

                                        {/* NỘI DUNG BƯỚC 1: CHỌN LOẠI */}
                                        {enrollStep === 1 && (
                                            <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                                                <button
                                                    onClick={() => handleSelectEnrollType("SUBSCRIPTION")}
                                                    className="w-full border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl p-4 text-left transition group"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-bold text-slate-800 group-hover:text-emerald-700">🎯 Dùng gói học</p>
                                                        <ArrowLeft className="rotate-180 text-slate-300 group-hover:text-emerald-500" size={18} />
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        Nâng cấp gói thành viên để học không giới hạn
                                                    </p>
                                                </button>

                                                <button
                                                    onClick={() => handleSelectEnrollType("SINGLE_PURCHASE")}
                                                    className="w-full border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl p-4 text-left transition group"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-bold text-slate-800 group-hover:text-emerald-700">💳 Mua lẻ khóa học</p>
                                                        <ArrowLeft className="rotate-180 text-slate-300 group-hover:text-emerald-500" size={18} />
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        Thanh toán một lần duy nhất cho khóa học này
                                                    </p>
                                                </button>

                                                <button
                                                    onClick={closeEnrollModal}
                                                    className="w-full py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 mt-2"
                                                >
                                                    Đóng
                                                </button>
                                            </div>
                                        )}

                                        {/* NỘI DUNG BƯỚC 2: CHỌN CỔNG THANH TOÁN */}
                                        {enrollStep === 2 && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="text-slate-500">Khóa học:</span>
                                                        <span className="font-bold text-slate-700 truncate w-40 text-right">{course.title}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-slate-500">Số tiền:</span>
                                                        <span className="font-bold text-emerald-600 text-lg">
                                                            {course.price.toLocaleString('vi-VN')} đ
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="text-sm font-medium text-slate-700">Chọn phương thức thanh toán:</p>

                                                <div className="space-y-3">
                                                    {/* VNPAY OPTION */}
                                                    <div
                                                        onClick={() => setPaymentMethod('VNPAY')}
                                                        className={`relative flex items-center p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'VNPAY' ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-slate-200 hover:border-slate-300'
                                                            }`}
                                                    >
                                                        <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center overflow-hidden">
                                                            <span className="text-[10px] font-bold text-blue-600">VNPAY</span>
                                                        </div>
                                                        <div className="ml-3 flex-1">
                                                            <p className="text-sm font-bold text-slate-800">Ví VNPAY</p>
                                                            <p className="text-xs text-slate-500">Quét mã QR qua ứng dụng ngân hàng</p>
                                                        </div>
                                                        {paymentMethod === 'VNPAY' && <CheckCircle size={20} className="text-emerald-600" />}
                                                    </div>

                                                    {/* MOMO OPTION */}
                                                    <div
                                                        onClick={() => setPaymentMethod('MOMO')}
                                                        className={`relative flex items-center p-3 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'MOMO' ? 'border-pink-500 bg-pink-50/50 ring-1 ring-pink-500' : 'border-slate-200 hover:border-slate-300'
                                                            }`}
                                                    >
                                                        <div className="w-10 h-10 bg-[#A50064] rounded border border-transparent flex items-center justify-center overflow-hidden">
                                                            <span className="text-[10px] font-bold text-white">MoMo</span>
                                                        </div>
                                                        <div className="ml-3 flex-1">
                                                            <p className="text-sm font-bold text-slate-800">Ví MoMo</p>
                                                            <p className="text-xs text-slate-500">Thanh toán qua ví điện tử MoMo</p>
                                                        </div>
                                                        {paymentMethod === 'MOMO' && <CheckCircle size={20} className="text-pink-600" />}
                                                    </div>
                                                </div>

                                                <button
                                                    disabled={enrolling}
                                                    onClick={handlePayment}
                                                    className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:bg-slate-400 mt-4 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                                                >
                                                    {enrolling ? (
                                                        <>Processing...</>
                                                    ) : (
                                                        <>
                                                            <CreditCard size={18} />
                                                            Thanh toán ngay
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Features */}
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