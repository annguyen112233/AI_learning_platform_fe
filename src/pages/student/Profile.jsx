import React, { useState, useRef, useEffect, useMemo } from 'react';
import { User, Mail, Lock, Camera, Save, Award, Phone, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { uploadAvatar, getProfile, updateProfile, changePassword } from '@/services/userService';
import { toast } from 'react-hot-toast';
import { useAuth } from "@/context/AuthContext";
import { formatDateVN } from "@/utils/helpers";

import DatePicker, { registerLocale } from "react-datepicker";
import vi from "date-fns/locale/vi";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("vi", vi);

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const { setUser } = useAuth();

  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: 'minh.student@example.com',
    notes: '',
    level: 'N5 - Sơ cấp',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    role: '',
    createdAt: '',
    imageUrl: '',
    phoneNumber: "",
    address: "",
    gender: "",
    birthOfDate: ""
  });

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
    return score; // 0 → 5
  };


  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const fetchProfileData = async () => {
    try {
      const res = await getProfile();
      const data = res.data.data;

      const mappedUser = {
        fullName: data.fullName || "",
        email: data.email || "",
        bio: data.notes || "",
        level: data.level || "N5 - Sơ cấp",
        role: data.role || "",
        createdAt: data.createdAt || "",
        avatarUrl: data.imageUrl || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        gender: data.gender || "",
        birthOfDate: data.birthOfDate || "",
      };

      setFormData((prev) => ({
        ...prev,
        ...mappedUser,
      }));

      // 🔥 sync global state
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

    // 1. Preview ảnh ngay lập tức
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      setLoading(true);
      console.log("Đang upload ảnh lên Cloud...");

      // BƯỚC A: Upload file lấy link
      const uploadRes = await uploadAvatar(file);
      console.log("Response từ server:", uploadRes);

      // --- SỬA QUAN TRỌNG: Lấy đúng đường dẫn ảnh ---
      // Dựa vào log cũ của bạn: data trả về dạng { success: true, data: 'link...' }
      // Nên ta cần lấy: uploadRes.data.data
      const newAvatarUrl = uploadRes.data?.data || uploadRes.data;

      // Kiểm tra nếu newAvatarUrl là string (link ảnh) thì mới chạy
      if (newAvatarUrl && typeof newAvatarUrl === 'string') {
        console.log("Link ảnh mới:", newAvatarUrl);
        setFormData(prev => ({ ...prev, avatarUrl: newAvatarUrl }));

        const updatedUser = {
          ...JSON.parse(sessionStorage.getItem("user") || "{}"),
          imageUrl: newAvatarUrl,
        };

        setUser(updatedUser);
        sessionStorage.setItem("user", JSON.stringify(updatedUser));


        alert("Upload ảnh thành công!");
      } else {
        console.error("Dữ liệu trả về không phải link ảnh:", newAvatarUrl);
        throw new Error("Không lấy được link ảnh hợp lệ.");
      }

    } catch (error) {
      console.error("Lỗi upload:", error);
      alert("Lỗi: Không thể upload ảnh.");
      // Reset về ảnh cũ nếu lỗi
      setPreviewUrl(formData.avatarUrl);
    } finally {
      setLoading(false);
      // Reset input để chọn lại được ảnh cũ nếu muốn
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
        birthOfDate: formData.birthOfDate, // yyyy-MM-dd
        notes: formData.bio,               // map bio -> notes backend
      };

      await updateProfile(payload);

      toast.success("Cập nhật thông tin thành công!");

      const updatedUser = {
        ...JSON.parse(sessionStorage.getItem("user") || "{}"),
        ...payload,
      };

      sessionStorage.setItem("user", JSON.stringify(updatedUser));

    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Cập nhật thất bại!"
      );
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
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Đổi mật khẩu thất bại!"
      );
    } finally {
      setChangingPassword(false);
    }
  };


  const strength = useMemo(() => {
    return getPasswordStrength(formData.newPassword || "");
  }, [formData.newPassword]);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold text-slate-800 mb-6">
        Hồ sơ cá nhân
      </h1>

      <div className="flex flex-col md:flex-row gap-8 items-stretch">

        {/* LEFT */}
        <div className="w-full md:w-80 shrink-0 space-y-6 h-full flex flex-col">

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-emerald-500 to-green-500"></div>

            <div className="relative mt-4 mb-4">
              <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-md relative">
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt="Avatar"
                    className={`w-full h-full rounded-full object-cover bg-slate-100 transition-opacity ${loading ? "opacity-50" : "opacity-100"
                      }`}
                  />
                ) : (
                  <div
                    className={`w-full h-full rounded-full flex items-center justify-center 
      bg-green-100 text-5xl transition-opacity ${loading ? "opacity-50" : "opacity-100"
                      }`}
                  >
                    🐳
                  </div>
                )}


                {/* Hiển thị xoay vòng khi đang upload */}
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <button
                type="button"
                onClick={handleCameraClick}
                className="absolute bottom-0 right-1/2 translate-x-10 translate-y-2 p-2 bg-white rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-600 cursor-pointer"
              >
                <Camera size={16} />
              </button>
            </div>

            <h2 className="font-bold text-lg text-slate-800">
              {formData.fullName}
            </h2>
            <p className="text-slate-500 text-sm mb-4">Học viên</p>

            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
              {formData.level}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mt-auto">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award size={18} className="text-yellow-500" /> Thành tích
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Ngày tạo tài khoản</span>
                <span className="font-medium text-slate-700">
                  {formatDateVN(formData.createdAt)}
                </span>

              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Khóa học đã xong</span>
                <span className="font-medium text-slate-700">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tổng giờ học</span>
                <span className="font-medium text-slate-700">24h 30p</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex border-b border-slate-100">
            {['general', 'security'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
              >
                {tab === 'general' ? 'Thông tin chung' : 'Bảo mật'}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === "general" ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    icon={User}
                    placeholder="Họ và tên"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />

                  <Input
                    icon={Mail}
                    placeholder="Email"
                    value={formData.email}
                    disabled
                    className="bg-slate-50 text-slate-500"
                  />

                  <Input
                    icon={Phone}
                    placeholder="Số điện thoại"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                  />

                  <Input
                    icon={MapPin}
                    placeholder="Địa chỉ"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />

                  {/* Gender */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-semibold text-slate-700">
                      Giới tính
                    </label>
                    <select
                      className="w-full p-2.5 rounded-lg border border-slate-300 
              focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 
              outline-none transition-all"
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

                  {/* Birth date */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-semibold text-slate-700">
                      Ngày sinh
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
                            ? date.toISOString().slice(0, 10) // yyyy-MM-dd gửi backend
                            : "",
                        })
                      }
                      className="w-full p-2.5 rounded-lg border border-slate-300 
      focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 
      outline-none transition-all"
                      maxDate={new Date()}   // không cho chọn ngày tương lai
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </div>

                </div>

                <textarea
                  rows={4}
                  placeholder="Giới thiệu bản thân..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl 
          focus:ring-2 focus:ring-emerald-500 text-sm"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                />

                <Button
                  type="submit"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  isLoading={loading}
                >
                  <Save size={18} /> Lưu thay đổi
                </Button>
              </form>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-6 max-w-lg">
                <Input
                  type="password"
                  icon={Lock}
                  placeholder="Mật khẩu hiện tại"
                  value={formData.currentPassword}
                  showToggle={true}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPassword: e.target.value })
                  }
                />

                <Input
                  type="password"
                  icon={Lock}
                  placeholder="Mật khẩu mới"
                  value={formData.newPassword}
                  showToggle={true}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                />

                {formData.newPassword && (
                  <div className="mt-2 space-y-3">

                    {/* Strength meter – full width dưới input */}
                    <div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${strength >= 4
                            ? "bg-emerald-500"
                            : strength >= 2
                              ? "bg-yellow-400"
                              : "bg-red-400"
                            }`}
                          style={{ width: `${(strength / 5) * 100}%` }}
                        />
                      </div>

                      <p
                        className={`mt-1 text-sm font-semibold ${strength >= 4
                          ? "text-emerald-600"
                          : strength >= 2
                            ? "text-yellow-500"
                            : "text-red-500"
                          }`}
                      >
                        {strength >= 4
                          ? "Mật khẩu mạnh"
                          : strength >= 2
                            ? "Mật khẩu trung bình"
                            : "Mật khẩu yếu"}
                      </p>
                    </div>

                    {/* Checklist – 2 cột */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                      <span className={passwordRules.length(formData.newPassword) ? "text-emerald-600" : "text-slate-400"}>
                        • Ít nhất 8 ký tự
                      </span>

                      <span className={passwordRules.uppercase(formData.newPassword) ? "text-emerald-600" : "text-slate-400"}>
                        • Có chữ in hoa (A-Z)
                      </span>

                      <span className={passwordRules.lowercase(formData.newPassword) ? "text-emerald-600" : "text-slate-400"}>
                        • Có chữ thường (a-z)
                      </span>

                      <span className={passwordRules.number(formData.newPassword) ? "text-emerald-600" : "text-slate-400"}>
                        • Có số (0-9)
                      </span>

                      <span className={passwordRules.special(formData.newPassword) ? "text-emerald-600" : "text-slate-400"}>
                        • Có ký tự đặc biệt (!@#$…)
                      </span>
                    </div>
                  </div>
                )}




                <Input
                  type="password"
                  icon={Lock}
                  placeholder="Xác nhận mật khẩu mới"
                  value={formData.confirmPassword}
                  showToggle={true}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                />

                <Button
                  type="submit"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  isLoading={changingPassword}
                >
                  <Save size={18} /> Đổi mật khẩu
                </Button>
              </form>

            )}
          </div>
        </div>
      </div>
    </div>
  );
}
