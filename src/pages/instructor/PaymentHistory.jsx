import { useEffect, useState } from "react";
import { getMyPayments } from "@/api/paymentApi";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  CreditCard,
} from "lucide-react";

function MyPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching payments...");
      const res = await getMyPayments();

      console.log("✅ Raw API Response:", res);
      console.log("📦 res.data:", res.data);

      // ✅ XỬ LÝ CÁC TRƯỜNG HỢP RESPONSE KHÁC NHAU
      let paymentsData = [];

      if (res.data?.data) {
        // Trường hợp: { data: { data: [...] } }
        paymentsData = res.data.data;
        console.log("📋 Payments from res.data.data:", paymentsData);
      } else if (Array.isArray(res.data)) {
        // Trường hợp: { data: [...] }
        paymentsData = res.data;
        console.log("📋 Payments from res.data:", paymentsData);
      } else if (res?.data) {
        // Trường hợp khác: kiểm tra res.data
        paymentsData = res.data;
        console.log("📋 Payments from res.data (fallback):", paymentsData);
      }

      // ✅ ĐẢM BẢO LUÔN LÀ ARRAY
      if (!Array.isArray(paymentsData)) {
        console.warn("⚠️ Payments data is not an array:", paymentsData);
        paymentsData = [];
      }

      console.log("✅ Final payments array:", paymentsData);
      setPayments(paymentsData);
    } catch (err) {
      console.error("❌ Get payments failed:", err);
      console.error("❌ Error response:", err?.response?.data);
      setError(
        err?.response?.data?.message || "Không thể tải lịch sử thanh toán",
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ HELPER: Format tiền VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // ✅ HELPER: Format ngày
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ✅ HELPER: Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      COMPLETE: {
        icon: CheckCircle,
        className: "bg-emerald-100 text-emerald-700 border-emerald-200",
        label: "Thành công",
      },
      COMPLETED: {
        icon: CheckCircle,
        className: "bg-emerald-100 text-emerald-700 border-emerald-200",
        label: "Thành công",
      },
      PENDING: {
        icon: Clock,
        className: "bg-yellow-100 text-yellow-700 border-yellow-200",
        label: "Đang xử lý",
      },
      FAILED: {
        icon: XCircle,
        className: "bg-red-100 text-red-700 border-red-200",
        label: "Thất bại",
      },
      CANCELLED: {
        icon: XCircle,
        className: "bg-slate-100 text-slate-700 border-slate-200",
        label: "Đã hủy",
      },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.className}`}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  // ✅ HELPER: Extract plan from notes
  const extractPlanFromNotes = (notes) => {
    if (!notes) return null;
    const match = notes.match(/Subscription Plan:\s*(\w+)/i);
    return match ? match[1] : null;
  };

  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
          <p className="text-slate-600 font-medium">
            Đang tải lịch sử thanh toán...
          </p>
        </div>
      </div>
    );
  }

  // ✅ ERROR STATE
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl border border-red-200 p-12 flex flex-col items-center justify-center">
          <XCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-slate-800 font-bold mb-2">Không thể tải dữ liệu</p>
          <p className="text-slate-600 text-sm mb-4">{error}</p>
          <button
            onClick={fetchPayments}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // ✅ EMPTY STATE
  if (payments.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center">
          <CreditCard className="w-16 h-16 text-slate-300 mb-4" />
          <p className="text-slate-800 font-bold mb-2">Chưa có giao dịch nào</p>
          <p className="text-slate-600 text-sm">
            Bạn chưa thực hiện thanh toán nào
          </p>
        </div>
      </div>
    );
  }

  // ✅ MAIN RENDER
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Lịch sử thanh toán
        </h2>
        <p className="text-slate-600 text-sm">
          Tổng số giao dịch:{" "}
          <span className="font-bold">{payments.length}</span>
        </p>
      </div>

      <div className="space-y-4">
        {payments.map((payment) => {
          const plan = extractPlanFromNotes(payment.notes);
          const paymentId = payment.paymentId || payment.id;

          return (
            <div
              key={paymentId}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-slate-800">
                      {plan
                        ? `Gói ${plan}`
                        : payment.subscriptionPlan || "Thanh toán"}
                    </h3>
                    {getStatusBadge(payment.status)}
                  </div>
                  <p className="text-sm text-slate-500">
                    Mã giao dịch: <span className="font-mono">{paymentId}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-emerald-600">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-slate-400" />
                  <div>
                    <p className="text-slate-500 text-xs">Ngày giao dịch</p>
                    <p className="font-medium text-slate-700">
                      {formatDate(payment.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <CreditCard size={16} className="text-slate-400" />
                  <div>
                    <p className="text-slate-500 text-xs">Phương thức</p>
                    <p className="font-medium text-slate-700">
                      {payment.paymentMethod || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <DollarSign size={16} className="text-slate-400" />
                  <div>
                    <p className="text-slate-500 text-xs">Mã đơn hàng</p>
                    <p className="font-medium text-slate-700 font-mono text-xs">
                      {payment.orderCode || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {payment.notes && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Ghi chú:</p>
                  <p className="text-sm text-slate-700">{payment.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ✅ DEBUG INFO (Có thể xóa khi production) */}
      <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <p className="text-xs font-bold text-slate-600 mb-2">Debug Info:</p>
        <pre className="text-xs text-slate-500 overflow-x-auto">
          {JSON.stringify(
            {
              totalPayments: payments.length,
              sample: payments[0] || null,
            },
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  );
}

export default MyPayments;
