import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft, Home, ShoppingBag, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button'; // Sử dụng lại Button của bạn
import { getSubscriptionStudent } from '@/services/subscriptionService';
import toast from 'react-hot-toast';


export default function PaymentResult() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Lấy các tham số từ URL trả về
    // Ví dụ: /payment-result?status=success&orderId=123456
    const status = searchParams.get('status');
    const orderId = searchParams.get('orderId');
    const message = searchParams.get('message') || searchParams.get('error'); // Hỗ trợ cả param error từ backend
    const resultCode = searchParams.get('resultCode'); // Dành cho trường hợp Momo redirect trực tiếp (0 = thành công)

    // Xác định trạng thái cuối cùng (Support cả logic redirect của Backend và logic raw của cổng thanh toán)
    const isSuccess = status === 'success' || resultCode === '0';
    const isFailed = status === 'failed' || (resultCode && resultCode !== '0');

    // Nếu chưa có param gì (người dùng truy cập trực tiếp link này), redirect về home
    useEffect(() => {
        if (!status && !resultCode && !orderId) {
            // Có thể show loading hoặc redirect về trang chủ
            // navigate('/');
        }
    }, [status, resultCode, orderId, navigate]);

    useEffect(() => {
        if (!isSuccess) return;

        const fetchSubscription = async () => {
            try {
                console.log("Calling getSubscriptionStudent...");
                const res = await getSubscriptionStudent();
                const data = res.data.data;

                toast.success(`Kích hoạt gói ${data.plan} thành công 🎉`);
                console.log("Subscription =", data);
            } catch (err) {
                console.error("Không lấy được subscription:", err);
                toast.error("Không thể cập nhật gói. Vui lòng F5 lại!");
            }
        };

        fetchSubscription();
    }, [isSuccess]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full overflow-hidden relative">
                {/* Decorative Header */}
                <div className={`h-32 w-full absolute top-0 left-0 ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

                <div className="relative pt-16 px-8 pb-8 text-center">
                    {/* Icon Trạng thái */}
                    <div className="mx-auto w-24 h-24 bg-white rounded-full p-2 shadow-lg mb-6 flex items-center justify-center">
                        {isSuccess ? (
                            <CheckCircle className="text-emerald-500 w-full h-full animate-in zoom-in duration-300" />
                        ) : (
                            <XCircle className="text-red-500 w-full h-full animate-in zoom-in duration-300" />
                        )}
                    </div>

                    {/* Nội dung chính */}
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">
                        {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
                    </h1>

                    <p className="text-slate-500 mb-6">
                        {isSuccess
                            ? 'Cảm ơn bạn đã đăng ký khóa học. Tài khoản của bạn đã được nâng cấp.'
                            : decodeURIComponent(message || 'Giao dịch bị hủy hoặc xảy ra lỗi trong quá trình xử lý.')}
                    </p>

                    {/* Chi tiết đơn hàng (Box xám) */}
                    <div className="bg-slate-50 rounded-xl p-4 mb-8 border border-slate-100 text-sm">
                        <div className="flex justify-between py-2 border-b border-slate-200">
                            <span className="text-slate-500">Mã giao dịch:</span>
                            <span className="font-mono font-bold text-slate-700">{orderId || '---'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-200">
                            <span className="text-slate-500">Thời gian:</span>
                            <span className="font-medium text-slate-700">{new Date().toLocaleString('vi-VN')}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-slate-500">Trạng thái:</span>
                            <span className={`font-bold ${isSuccess ? 'text-emerald-600' : 'text-red-600'}`}>
                                {isSuccess ? 'Đã thanh toán' : 'Chưa hoàn tất'}
                            </span>
                        </div>
                    </div>

                    {/* Button Actions */}
                    <div className="space-y-3">
                        {isSuccess ? (
                            <Button
                                onClick={() => navigate('/student/profile?tab=upgrade')}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                            >
                                <ShoppingBag size={18} className="mr-2" /> Kiểm tra gói dịch vụ
                            </Button>

                        ) : (
                            <Button onClick={() => navigate('/student/profile')} className="w-full bg-slate-800 hover:bg-slate-900 text-white">
                                <ArrowLeft size={18} className="mr-2" /> Thử thanh toán lại
                            </Button>
                        )}

                        <button
                            onClick={() => navigate('/student/dashboard')}
                            className="w-full py-3 text-slate-500 font-semibold text-sm hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <Home size={16} /> Về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}