// src/pages/PaymentResult.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react";

export default function PaymentResult() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  const status = params.get("status"); // "success" | "failed"
  const orderId = params.get("orderId");

  useEffect(() => {
    if (status === "success") {
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
  }, [status, navigate]);

  const isSuccess = status === "success";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mb-6">
          {isSuccess ? (
            <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-emerald-600" size={48} />
            </div>
          ) : (
            <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="text-red-600" size={48} />
            </div>
          )}
        </div>

        {/* Title */}
        <h2
          className={`text-2xl font-bold mb-2 ${isSuccess ? "text-emerald-600" : "text-red-600"}`}
        >
          {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
        </h2>

        {/* Message */}
        <p className="text-slate-600 mb-6">
          {isSuccess
            ? "Gói nâng cấp của bạn đã được kích hoạt."
            : "Giao dịch không thành công. Vui lòng thử lại sau."}
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <p className="text-xs text-slate-500 mb-1">Mã giao dịch</p>
            <p className="font-mono text-sm font-bold text-slate-800">
              {orderId}
            </p>
          </div>
        )}

        {/* Auto redirect countdown */}
        {isSuccess && (
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-6">
            <Clock size={16} />
            <span>Tự động chuyển về trang cá nhân sau {countdown}s...</span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/instructor/profile?tab=earnings")}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
              isSuccess
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-slate-800 hover:bg-slate-900"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              Về trang cá nhân <ArrowRight size={18} />
            </span>
          </button>

          {!isSuccess && (
            <button
              onClick={() => navigate("/instructor/profile?tab=earnings")}
              className="w-full py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Thử lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
