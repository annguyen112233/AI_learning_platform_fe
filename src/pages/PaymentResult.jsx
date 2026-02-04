import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Receipt,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { getSubscriptionStudent } from "@/services/subscriptionService";

export default function PaymentResult() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  // Parse query parameters
  const status = params.get("status"); // "success" | "failed" | "error"
  const orderId = params.get("orderId");
  const errorMessage = params.get("error"); // Nếu có lỗi từ backend

  const isSuccess = status === "success";
  const isFailed = status === "failed" || status === "error";

  // 1. Logic gọi API cập nhật/kiểm tra gói khi thanh toán thành công
  useEffect(() => {
    if (!isSuccess) return;

    const fetchSubscription = async () => {
      try {
        console.log("Calling getSubscriptionStudent...");
        const res = await getSubscriptionStudent();
        // Kiểm tra cấu trúc response thực tế của bạn
        const data = res.data?.data || res.data; 

        toast.success(`Kích hoạt gói thành công 🎉`);
        console.log("Subscription =", data);
      } catch (err) {
        console.error("Không lấy được subscription:", err);
        // Không chặn UI thành công, chỉ báo lỗi nhỏ hoặc log lại
        toast.error("Thanh toán thành công nhưng chưa cập nhật được hiển thị gói. Vui lòng F5!");
      }
    };

    fetchSubscription();
  }, [isSuccess]);

  // 2. Logic đếm ngược tự động chuyển trang
  useEffect(() => {
    if (isSuccess) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/instructor/profile?tab=earnings");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isSuccess, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300 relative overflow-hidden">
        
        {/* Decorative Background Blur */}
        <div className={`absolute top-0 left-0 w-full h-2 ${isSuccess ? 'bg-emerald-500' : isFailed ? 'bg-red-500' : 'bg-yellow-500'}`}></div>

        {/* Icon */}
        <div className="mb-6 mt-4">
          {isSuccess ? (
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle
                className="text-emerald-600"
                size={56}
                strokeWidth={2.5}
              />
            </div>
          ) : isFailed ? (
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center shadow-lg">
              <XCircle className="text-red-600" size={56} strokeWidth={2.5} />
            </div>
          ) : (
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-full flex items-center justify-center shadow-lg">
              <AlertTriangle
                className="text-yellow-600"
                size={56}
                strokeWidth={2.5}
              />
            </div>
          )}
        </div>

        {/* Title */}
        <h2
          className={`text-3xl font-bold mb-3 ${
            isSuccess
              ? "text-emerald-600"
              : isFailed
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          {isSuccess
            ? "Thanh toán thành công!"
            : isFailed
            ? "Thanh toán thất bại"
            : "Lỗi xử lý thanh toán"}
        </h2>

        {/* Message */}
        <p className="text-slate-600 mb-6 text-base leading-relaxed">
          {isSuccess
            ? "Gói nâng cấp của bạn đã được kích hoạt. Bạn có thể bắt đầu sử dụng các tính năng Premium ngay bây giờ!"
            : isFailed
            ? "Giao dịch không thành công. Vui lòng kiểm tra lại thông tin thanh toán hoặc thử lại sau."
            : errorMessage || "Có lỗi xảy ra trong quá trình xử lý thanh toán."}
        </p>

        {/* Error Details (nếu có) */}
        {errorMessage && !isSuccess && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6 text-left">
            <p className="text-xs font-bold text-red-600 uppercase mb-1">
              Chi tiết lỗi
            </p>
            <p className="text-sm text-red-700 font-mono break-words">
              {decodeURIComponent(errorMessage)}
            </p>
          </div>
        )}

        {/* Order ID */}
        {orderId && (
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Receipt size={16} className="text-slate-400" />
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                Mã giao dịch
              </p>
            </div>
            <p className="font-mono text-sm font-bold text-slate-800 break-all">
              {orderId}
            </p>
          </div>
        )}

        {/* Auto redirect countdown (chỉ hiện khi thành công) */}
        {isSuccess && (
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-6 bg-emerald-50 py-3 rounded-lg border border-emerald-100">
            <Clock size={16} className="animate-pulse text-emerald-600" />
            <span className="font-medium">
              Tự động chuyển trang sau{" "}
              <span className="font-bold text-emerald-600">{countdown}s</span>
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/instructor/profile?tab=earnings")}
            className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl active:scale-95 ${
              isSuccess
                ? "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600"
                : "bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-900 hover:to-slate-800"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {isSuccess ? "Về trang cá nhân" : "Quay lại trang cá nhân"}
              <ArrowRight size={18} />
            </span>
          </button>

          {!isSuccess && (
            <button
              onClick={() => navigate("/payment-retry")} 
              // Lưu ý: Sửa link này về trang thanh toán lại của bạn nếu cần
              className="w-full py-3.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 border-2 border-slate-200 transition-all active:scale-95"
            >
              Thử lại thanh toán
            </button>
          )}

          {/* Support contact */}
          {!isSuccess && (
            <p className="text-xs text-slate-400 mt-4">
              Cần hỗ trợ? Liên hệ{" "}
              <a
                href="mailto:support@yourdomain.com"
                className="text-blue-600 hover:underline font-semibold"
              >
                support@yourdomain.com
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}