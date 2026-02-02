import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  User,
  Mail,
  Lock,
  Camera,
  Save,
  Award,
  Phone,
  MapPin,
  Crown,
  Zap,
  Check,
  CreditCard,
  Shield,
  Clock,
  Calendar,
  BookOpen,
  Users,
  TrendingUp,
  DollarSign,
  Star,
  X,
  Smartphone,
  Globe,
  Sparkles,
  Bot,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  uploadAvatar,
  getProfile,
  updateProfile,
  changePassword,
} from "@/services/userService";
import {
  createPaymentVnpay,
  createPaymentMomo,
} from "@/services/paymentService";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { formatDateVN } from "@/utils/helpers";
import DatePicker, { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("vi", vi);

// --- ĐỊNH NGHĨA CÁC GÓI NÂNG CẤP CHO GIẢNG VIÊN ---
const INSTRUCTOR_PLANS = [
  {
    id: "BASIC",
    name: "Cơ Bản",
    price: 300000,
    period: "/ 3 tháng",
    description: "Bắt đầu hành trình giảng dạy.",
    features: [
      "Tạo tối đa 3 khóa học",
      "Upload video 2GB",
      "AI tạo Quiz (10 câu/tháng)",
      "AI chấm điểm tự động",
      "Hỗ trợ qua Email",
    ],
    aiFeatures: [],
    color: "border-slate-200 bg-white",
    btnColor: "bg-slate-100 text-slate-600 hover:bg-slate-200",
    icon: User,
  },
  {
    id: "PREMIUM",
    name: "Chuyên Nghiệp",
    price: 800000,
    period: "/ 1 năm",
    description: "Dành cho giảng viên chuyên nghiệp.",
    features: [
      "Tạo không giới hạn khóa học",
      "Upload video 20GB",
      "AI tạo Quiz & bài tập không giới hạn",
      "AI chấm điểm & phân tích lỗi",
      "AI gợi ý nội dung bài học",
      "Phân tích chi tiết học viên",
      "Hỗ trợ ưu tiên 24/7",
    ],
    aiFeatures: [],
    recommended: true,
    color: "border-emerald-500 bg-emerald-50/20",
    btnColor:
      "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200",
    icon: Award,
  },
  {
    id: "ENTERPRISE",
    name: "Doanh Nghiệp",
    price: 2000000,
    period: "/ trọn đời",
    description: "Giải pháp toàn diện cho tổ chức.",
    features: [
      "Mọi tính năng Premium",
      "Upload video không giới hạn",
      "Sensei AI - Trợ lý 24/7",
      "AI tạo khóa học tự động",
      "AI chấm bài Speaking & Writing",
      "AI phân tích hiệu quả giảng dạy",
      "API tích hợp & Hỗ trợ VIP",
    ],
    aiFeatures: [],
    color: "border-purple-500 bg-purple-50/20",
    btnColor: "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200",
    icon: Crown,
  },
];

export default function InstructorProfile() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const { setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // State cho phần nâng cấp
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // --- STATE DATA ---
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    notes: "",
    level: "Giảng viên",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    role: "",
    createdAt: "",
    imageUrl: "",
    phoneNumber: "",
    address: "",
    gender: "",
    birthOfDate: "",
  });

  // --- LOGIC PASSWORD ---
  const passwordRules = {
    length: (pw) => pw.length >= 8,
    uppercase: (pw) => /[A-Z]/.test(pw),
    lowercase: (pw) => /[a-z]/.test(pw),
    number: (pw) => /[0-9]/.test(pw),
    special: (pw) => /[^A-Za-z0-9]/.test(pw),
  };

  const getPasswordStrength = (pw) => {
    let score = 0;
    Object.values(passwordRules).forEach((rule) => {
      if (rule(pw)) score++;
    });
    return score;
  };

  const strength = useMemo(() => {
    return getPasswordStrength(formData.newPassword || "");
  }, [formData.newPassword]);

  // --- PAYMENT LOGIC ---
  const handleBuyPlan = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handleProcessPayment = async (method) => {
    if (!selectedPlan) return;

    try {
      setProcessingPayment(true);

      const subscriptionPlan = selectedPlan.id; // "BASIC", "PREMIUM", "ENTERPRISE"
      const amount = selectedPlan.price; // 300000, 800000, 2000000
      const orderInfo = `Nang cap goi ${selectedPlan.id} - Giang vien`;

      let res;

      // ✅ Gọi API đúng format
      if (method === "MOMO") {
        res = await createPaymentMomo(subscriptionPlan, amount, orderInfo);
      }

      if (method === "VNPAY") {
        res = await createPaymentVnpay(subscriptionPlan, amount, orderInfo);
      }

      // ✅ Lấy paymentUrl từ response
      // Backend trả về: { data: { paymentUrl: "..." } }
      const payUrl = res?.data?.data?.paymentUrl || res?.data?.paymentUrl;

      if (!payUrl) {
        console.error("Backend response:", res?.data);
        toast.error("Không lấy được link thanh toán từ server!");
        setProcessingPayment(false);
        return;
      }

      toast.success("Đang chuyển hướng tới cổng thanh toán...");

      // ✅ Redirect sang payment gateway
      window.location.href = payUrl;
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Tạo thanh toán thất bại. Vui lòng thử lại!",
      );
      setProcessingPayment(false);
    }
  };

  // --- API CALLS ---
  const fetchProfileData = async () => {
    try {
      const res = await getProfile();
      const data = res.data.data;
      const mappedUser = {
        fullName: data.fullName || "",
        email: data.email || "",
        bio: data.notes || "",
        level: "Giảng viên",
        role: data.role || "",
        createdAt: data.createdAt || "",
        imageUrl: data.imageUrl || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        gender: data.gender || "",
        birthOfDate: data.birthOfDate || "",
      };
      setUser(mappedUser);
      setFormData((prev) => ({ ...prev, ...mappedUser }));
      sessionStorage.setItem("user", JSON.stringify(mappedUser));
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu hồ sơ:", error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      setLoading(true);
      const uploadRes = await uploadAvatar(file);
      const newAvatarUrl = uploadRes.data?.data || uploadRes.data;

      if (newAvatarUrl && typeof newAvatarUrl === "string") {
        setFormData((prev) => ({ ...prev, imageUrl: newAvatarUrl }));
        const updatedUser = {
          ...JSON.parse(sessionStorage.getItem("user") || "{}"),
          imageUrl: newAvatarUrl,
        };
        setUser(updatedUser);
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Cập nhật ảnh đại diện thành công!");
      } else {
        throw new Error("Link ảnh không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi upload:", error);
      toast.error("Không thể tải ảnh lên");
      setPreviewUrl(formData.imageUrl);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        gender: formData.gender,
        birthOfDate: formData.birthOfDate,
        notes: formData.bio,
      };
      await updateProfile(payload);
      toast.success("Cập nhật thông tin thành công!");
      const updatedUser = {
        ...JSON.parse(sessionStorage.getItem("user") || "{}"),
        ...payload,
      };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    if (strength < 4) {
      toast.error("Mật khẩu chưa đủ mạnh");
      return;
    }
    try {
      setChangingPassword(true);
      const payload = {
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };
      await changePassword(payload);
      toast.success("Đổi mật khẩu thành công!");
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Đổi mật khẩu thất bại!");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  // --- RENDER ---
  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Hồ sơ giảng viên
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Quản lý thông tin cá nhân và tài khoản giảng dạy
          </p>
        </div>

        {/* Quick Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-sm font-bold">
          <Zap size={16} className="fill-current" /> Instructor Portal
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* === LEFT SIDEBAR === */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          {/* Avatar Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center relative overflow-hidden group">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-emerald-600 to-teal-500">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-[length:10px_10px]"></div>
            </div>

            <div className="relative mt-8 mb-4">
              <div className="w-28 h-28 mx-auto bg-white rounded-full p-1.5 shadow-lg relative">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  {formData.imageUrl || previewUrl ? (
                    <img
                      src={previewUrl || formData.imageUrl}
                      alt="Avatar"
                      className={`w-full h-full object-cover bg-slate-100 transition-opacity ${
                        loading ? "opacity-50" : "opacity-100"
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-4xl">
                      👨‍🏫
                    </div>
                  )}
                </div>

                {/* Loading overlay */}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full z-10">
                    <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Camera Button */}
                <button
                  type="button"
                  onClick={handleCameraClick}
                  className="absolute bottom-1 right-1 p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-full shadow-md border border-slate-200 transition-transform active:scale-95"
                  title="Đổi ảnh đại diện"
                >
                  <Camera size={16} />
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            <h2 className="font-bold text-xl text-slate-800">
              {formData.fullName || "Giảng viên"}
            </h2>
            <p className="text-slate-500 text-sm mb-4">{formData.email}</p>

            <div className="grid grid-cols-2 gap-2 mt-6 pt-6 border-t border-slate-100">
              <div className="text-center">
                <div className="text-xs text-slate-400 font-medium uppercase mb-1">
                  Ngày tham gia
                </div>
                <div className="text-sm font-bold text-slate-700">
                  {formatDateVN(formData.createdAt) || "N/A"}
                </div>
              </div>
              <div className="text-center border-l border-slate-100">
                <div className="text-xs text-slate-400 font-medium uppercase mb-1">
                  Vai trò
                </div>
                <div className="text-sm font-bold text-slate-700">
                  Giảng viên
                </div>
              </div>
            </div>
          </div>

          {/* Mini Stats */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award size={18} className="text-orange-500" /> Thống kê giảng dạy
            </h3>
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <BookOpen size={16} />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Khóa học
                  </span>
                </div>
                <span className="font-bold text-slate-800">12</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Users size={16} />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Học viên
                  </span>
                </div>
                <span className="font-bold text-slate-800">284</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                    <DollarSign size={16} />
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Doanh thu
                  </span>
                </div>
                <span className="font-bold text-slate-800">45M đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* === RIGHT MAIN CONTENT === */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          {/* Custom Tabs */}
          <div className="flex border-b border-slate-100 px-2 overflow-x-auto no-scrollbar">
            {[
              { id: "general", label: "Thông tin chung", icon: User },
              { id: "security", label: "Bảo mật & Mật khẩu", icon: Shield },
              {
                id: "earnings",
                label: "Nâng cấp tài khoản",
                icon: Crown,
                isSpecial: true,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? tab.isSpecial
                        ? "border-emerald-500 text-emerald-600 bg-emerald-50/50"
                        : "border-emerald-600 text-emerald-600 bg-emerald-50/50"
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }
                `}
              >
                {tab.isSpecial ? (
                  <span className="relative flex items-center gap-2">
                    <tab.icon size={18} />
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                      {tab.label}
                    </span>
                  </span>
                ) : (
                  <>
                    <tab.icon size={18} /> {tab.label}
                  </>
                )}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8 flex-1">
            {/* TAB 1: GENERAL INFO */}
            {activeTab === "general" && (
              <form
                onSubmit={handleSave}
                className="space-y-6 animate-in fade-in duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    icon={User}
                    label="Họ và tên"
                    placeholder="Nhập họ tên"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                  <Input
                    icon={Mail}
                    label="Email đăng nhập"
                    value={formData.email}
                    disabled
                    className="bg-slate-50 text-slate-500"
                  />
                  <Input
                    icon={Phone}
                    label="Số điện thoại"
                    placeholder="09xxxxxxx"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                  />
                  <Input
                    icon={MapPin}
                    label="Địa chỉ"
                    placeholder="Tỉnh/Thành phố"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                      Giới tính
                    </label>
                    <select
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    >
                      <option value="">-- Chọn giới tính --</option>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Calendar size={14} /> Ngày sinh
                    </label>
                    <DatePicker
                      locale="vi"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Chọn ngày sinh"
                      selected={
                        formData.birthOfDate
                          ? new Date(formData.birthOfDate)
                          : null
                      }
                      onChange={(date) =>
                        setFormData({
                          ...formData,
                          birthOfDate: date
                            ? date.toISOString().slice(0, 10)
                            : "",
                        })
                      }
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                      maxDate={new Date()}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">
                    Giới thiệu bản thân
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Kinh nghiệm giảng dạy, chuyên môn..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                    isLoading={loading}
                  >
                    <Save size={18} className="mr-2" /> Lưu thay đổi
                  </Button>
                </div>
              </form>
            )}

            {/* TAB 2: SECURITY */}
            {activeTab === "security" && (
              <div className="max-w-xl mx-auto animate-in fade-in duration-300">
                <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm flex gap-3 items-start border border-blue-100">
                  <Shield size={20} className="shrink-0 mt-0.5" />
                  <p>
                    Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu với
                    người khác. Mật khẩu nên bao gồm chữ hoa, số và ký tự đặc
                    biệt.
                  </p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-6">
                  <Input
                    type="password"
                    icon={Lock}
                    label="Mật khẩu hiện tại"
                    placeholder="••••••••"
                    value={formData.currentPassword}
                    showToggle={true}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentPassword: e.target.value,
                      })
                    }
                  />

                  <div>
                    <Input
                      type="password"
                      icon={Lock}
                      label="Mật khẩu mới"
                      placeholder="••••••••"
                      value={formData.newPassword}
                      showToggle={true}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    {/* Strength Indicator */}
                    {formData.newPassword && (
                      <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-slate-500">
                            Độ mạnh mật khẩu
                          </span>
                          <span
                            className={`text-xs font-bold ${
                              strength >= 4
                                ? "text-emerald-600"
                                : strength >= 2
                                  ? "text-yellow-500"
                                  : "text-red-500"
                            }`}
                          >
                            {strength >= 4
                              ? "Tuyệt vời"
                              : strength >= 2
                                ? "Khá"
                                : "Yếu"}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                          <div
                            className={`h-full transition-all duration-300 ${
                              strength >= 4
                                ? "bg-emerald-500"
                                : strength >= 2
                                  ? "bg-yellow-400"
                                  : "bg-red-400"
                            }`}
                            style={{ width: `${(strength / 5) * 100}%` }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          {Object.keys(passwordRules).map((key) => (
                            <div
                              key={key}
                              className={`flex items-center gap-1.5 ${
                                passwordRules[key](formData.newPassword)
                                  ? "text-emerald-600"
                                  : "text-slate-400"
                              }`}
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  passwordRules[key](formData.newPassword)
                                    ? "bg-emerald-500"
                                    : "bg-slate-300"
                                }`}
                              ></div>
                              {key === "length" && "Tối thiểu 8 ký tự"}
                              {key === "uppercase" && "Chữ in hoa (A-Z)"}
                              {key === "lowercase" && "Chữ thường (a-z)"}
                              {key === "number" && "Số (0-9)"}
                              {key === "special" && "Ký tự đặc biệt"}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Input
                    type="password"
                    icon={Lock}
                    label="Xác nhận mật khẩu"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    showToggle={true}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      className="bg-slate-800 hover:bg-slate-900 text-white"
                      isLoading={changingPassword}
                    >
                      <Save size={18} className="mr-2" /> Cập nhật mật khẩu
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: UPGRADE PLANS */}
            {activeTab === "earnings" && (
              <div className="animate-in zoom-in-50 duration-300 pb-6">
                <div className="text-center mb-10">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
                    Nâng cấp tài khoản{" "}
                    <Sparkles className="text-yellow-500" size={24} />
                  </h2>
                  <p className="text-slate-500 mt-2">
                    Chọn gói phù hợp để mở khóa toàn bộ tính năng giảng dạy
                    chuyên nghiệp
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
                  {INSTRUCTOR_PLANS.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative rounded-2xl p-6 border-2 flex flex-col h-full transition-all hover:shadow-xl ${plan.color} ${plan.recommended ? "scale-105 shadow-lg z-10" : "hover:-translate-y-1"}`}
                    >
                      {plan.recommended && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md uppercase tracking-wider">
                          Khuyên dùng
                        </div>
                      )}

                      {/* Header */}
                      <div className="mb-6">
                        <div className="flex justify-between items-start mb-2">
                          <div
                            className={`p-2 rounded-lg ${plan.recommended ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"}`}
                          >
                            <plan.icon size={24} />
                          </div>
                          {plan.id === "ENTERPRISE" && (
                            <span className="text-[10px] font-bold bg-purple-100 text-purple-600 px-2 py-1 rounded">
                              VIP
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">
                          {plan.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {plan.description}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="mb-6">
                        <span className="text-3xl font-extrabold text-slate-900">
                          {plan.price.toLocaleString()}đ
                        </span>
                        <span className="text-slate-500 text-sm font-medium">
                          {plan.period}
                        </span>
                      </div>

                      {/* Button */}
                      <button
                        onClick={() => handleBuyPlan(plan)}
                        className={`w-full py-3 rounded-xl font-bold text-sm mb-6 transition-all active:scale-95 shadow-lg ${plan.btnColor}`}
                      >
                        Chọn gói này
                      </button>

                      {/* Features List */}
                      <div className="space-y-4 flex-1">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase mb-3">
                            Tính năng nổi bật
                          </p>
                          <ul className="space-y-3">
                            {plan.features.map((feature, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm text-slate-600"
                              >
                                <Check
                                  size={16}
                                  className={`mt-0.5 shrink-0 ${plan.recommended ? "text-emerald-500" : "text-slate-400"}`}
                                />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex flex-col md:flex-row justify-center items-center gap-6 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <CreditCard size={14} /> Thanh toán đa dạng (Momo/VNPAY)
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield size={14} /> Bảo mật thông tin tuyệt đối
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> Kích hoạt ngay lập tức
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPaymentModal(false)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Thanh toán</h3>
                <p className="text-sm text-slate-500">
                  Chọn phương thức thanh toán an toàn
                </p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Thông tin gói */}
              <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                    Gói nâng cấp
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {selectedPlan.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">Tổng tiền</p>
                  <p className="text-xl font-extrabold text-emerald-600">
                    {selectedPlan.price.toLocaleString()}đ
                  </p>
                </div>
              </div>

              {/* Lựa chọn thanh toán */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700">
                  Chọn cổng thanh toán:
                </p>

                {/* Nút MOMO */}
                <button
                  onClick={() => handleProcessPayment("MOMO")}
                  disabled={processingPayment}
                  className="w-full group relative flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 hover:border-[#A50064] hover:bg-[#A50064]/5 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#A50064] text-white flex items-center justify-center font-bold text-xs shadow-md">
                      MoMo
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800 group-hover:text-[#A50064]">
                        Ví điện tử Momo
                      </p>
                      <p className="text-xs text-slate-500">
                        Quét mã QR cực nhanh
                      </p>
                    </div>
                  </div>
                  {processingPayment ? (
                    <div className="animate-spin w-5 h-5 border-2 border-[#A50064] border-t-transparent rounded-full" />
                  ) : (
                    <Smartphone className="text-slate-300 group-hover:text-[#A50064]" />
                  )}
                </button>

                {/* Nút VNPAY */}
                <button
                  onClick={() => handleProcessPayment("VNPAY")}
                  disabled={processingPayment}
                  className="w-full group relative flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 hover:border-[#005BAA] hover:bg-[#005BAA]/5 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#005BAA] to-[#ED1C24] text-white flex items-center justify-center font-bold text-[10px] shadow-md leading-tight">
                      VNPAY
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-800 group-hover:text-[#005BAA]">
                        VNPAY-QR / ATM
                      </p>
                      <p className="text-xs text-slate-500">
                        Thẻ nội địa & Quốc tế
                      </p>
                    </div>
                  </div>
                  {processingPayment ? (
                    <div className="animate-spin w-5 h-5 border-2 border-[#005BAA] border-t-transparent rounded-full" />
                  ) : (
                    <Globe className="text-slate-300 group-hover:text-[#005BAA]" />
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 text-center text-[11px] text-slate-400">
              Bằng việc thanh toán, bạn đồng ý với Điều khoản dịch vụ của chúng
              tôi.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
