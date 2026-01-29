import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  User, Mail, Lock, Camera, Save, Award, Phone, MapPin, 
  Crown, Zap, Check, CreditCard, Shield, Clock, Calendar 
} from 'lucide-react';
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

  // --- STATE DATA ---
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
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

  // --- API CALLS ---
  const fetchProfileData = async () => {
    try {
      const res = await getProfile();
      const data = res.data.data;
      const mappedUser = {
        fullName: data.fullName || "",
        email: data.email || "",
        bio: data.notes || "",
        level: data.level || "N5",
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

      if (newAvatarUrl && typeof newAvatarUrl === 'string') {
        setFormData(prev => ({ ...prev, imageUrl: newAvatarUrl })); // Fix key logic
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
      if (fileInputRef.current) fileInputRef.current.value = '';
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
          <h1 className="text-2xl font-bold text-slate-800">Hồ sơ học viên</h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý thông tin cá nhân và gói học tập</p>
        </div>
        
        {/* Quick Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-sm font-bold">
          <Zap size={16} className="fill-current" /> Đang học: {formData.level}
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
                        className={`w-full h-full object-cover bg-slate-100 transition-opacity ${loading ? "opacity-50" : "opacity-100"}`}
                    />
                    ) : (
                    <div className={`w-full h-full flex items-center justify-center bg-slate-100 text-4xl`}>
                        🐣
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

            <h2 className="font-bold text-xl text-slate-800">{formData.fullName || "Học viên mới"}</h2>
            <p className="text-slate-500 text-sm mb-4">{formData.email}</p>

            <div className="grid grid-cols-2 gap-2 mt-6 pt-6 border-t border-slate-100">
                <div className="text-center">
                    <div className="text-xs text-slate-400 font-medium uppercase mb-1">Ngày tham gia</div>
                    <div className="text-sm font-bold text-slate-700">{formatDateVN(formData.createdAt) || "N/A"}</div>
                </div>
                <div className="text-center border-l border-slate-100">
                    <div className="text-xs text-slate-400 font-medium uppercase mb-1">Gói hiện tại</div>
                    <div className="text-sm font-bold text-slate-700">Miễn phí</div>
                </div>
            </div>
          </div>

          {/* Mini Stats */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award size={18} className="text-orange-500" /> Thống kê học tập
            </h3>
            <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Clock size={16}/></div>
                        <span className="text-sm font-medium text-slate-600">Thời gian học</span>
                    </div>
                    <span className="font-bold text-slate-800">24.5h</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center"><Check size={16}/></div>
                        <span className="text-sm font-medium text-slate-600">Bài hoàn thành</span>
                    </div>
                    <span className="font-bold text-slate-800">12</span>
                </div>
            </div>
          </div>
        </div>

        {/* === RIGHT MAIN CONTENT === */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          
          {/* Custom Tabs */}
          <div className="flex border-b border-slate-100 px-2 overflow-x-auto no-scrollbar">
            {[
                { id: 'general', label: 'Thông tin chung', icon: User },
                { id: 'security', label: 'Bảo mật & Mật khẩu', icon: Shield },
                { id: 'upgrade', label: 'Nâng cấp VIP', icon: Crown, isSpecial: true }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap
                  ${activeTab === tab.id
                    ? tab.isSpecial 
                        ? 'border-orange-500 text-orange-600 bg-orange-50/50' 
                        : 'border-emerald-600 text-emerald-600 bg-emerald-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }
                `}
              >
                {tab.isSpecial ? (
                    <span className="relative flex items-center gap-2">
                         <tab.icon size={18} className="fill-current animate-pulse"/> 
                         <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">{tab.label}</span>
                         {/* Badge Mới */}
                         <span className="absolute -top-3 -right-6 px-1.5 py-0.5 bg-red-500 text-white text-[9px] rounded-full">HOT</span>
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
              <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input icon={User} label="Họ và tên" placeholder="Nhập họ tên" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                  <Input icon={Mail} label="Email đăng nhập" value={formData.email} disabled className="bg-slate-50 text-slate-500" />
                  <Input icon={Phone} label="Số điện thoại" placeholder="09xxxxxxx" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                  <Input icon={MapPin} label="Địa chỉ" placeholder="Tỉnh/Thành phố" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Giới tính</label>
                    <select className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                      <option value="">-- Chọn giới tính --</option>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Calendar size={14}/> Ngày sinh</label>
                    <DatePicker
                      locale="vi"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Chọn ngày sinh"
                      selected={formData.birthOfDate ? new Date(formData.birthOfDate) : null}
                      onChange={(date) => setFormData({ ...formData, birthOfDate: date ? date.toISOString().slice(0, 10) : "" })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                      maxDate={new Date()}
                      showMonthDropdown showYearDropdown dropdownMode="select"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                     <label className="text-sm font-semibold text-slate-700">Giới thiệu bản thân</label>
                    <textarea
                    rows={4}
                    placeholder="Mục tiêu học tiếng Nhật của bạn là gì?..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200" isLoading={loading}>
                        <Save size={18} className="mr-2"/> Lưu thay đổi
                    </Button>
                </div>
              </form>
            )}

            {/* TAB 2: SECURITY */}
            {activeTab === "security" && (
              <div className="max-w-xl mx-auto animate-in fade-in duration-300">
                  <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm flex gap-3 items-start border border-blue-100">
                     <Shield size={20} className="shrink-0 mt-0.5"/>
                     <p>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu với người khác. Mật khẩu nên bao gồm chữ hoa, số và ký tự đặc biệt.</p>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <Input type="password" icon={Lock} label="Mật khẩu hiện tại" placeholder="••••••••" value={formData.currentPassword} showToggle={true} onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })} />
                    
                    <div>
                        <Input type="password" icon={Lock} label="Mật khẩu mới" placeholder="••••••••" value={formData.newPassword} showToggle={true} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} />
                        {/* Strength Indicator */}
                        {formData.newPassword && (
                        <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold text-slate-500">Độ mạnh mật khẩu</span>
                                <span className={`text-xs font-bold ${strength >= 4 ? "text-emerald-600" : strength >= 2 ? "text-yellow-500" : "text-red-500"}`}>
                                    {strength >= 4 ? "Tuyệt vời" : strength >= 2 ? "Khá" : "Yếu"}
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                                <div className={`h-full transition-all duration-300 ${strength >= 4 ? "bg-emerald-500" : strength >= 2 ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${(strength / 5) * 100}%` }} />
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                {Object.keys(passwordRules).map((key) => (
                                    <div key={key} className={`flex items-center gap-1.5 ${passwordRules[key](formData.newPassword) ? "text-emerald-600" : "text-slate-400"}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${passwordRules[key](formData.newPassword) ? "bg-emerald-500" : "bg-slate-300"}`}></div>
                                        {key === 'length' && 'Tối thiểu 8 ký tự'}
                                        {key === 'uppercase' && 'Chữ in hoa (A-Z)'}
                                        {key === 'lowercase' && 'Chữ thường (a-z)'}
                                        {key === 'number' && 'Số (0-9)'}
                                        {key === 'special' && 'Ký tự đặc biệt'}
                                    </div>
                                ))}
                            </div>
                        </div>
                        )}
                    </div>

                    <Input type="password" icon={Lock} label="Xác nhận mật khẩu" placeholder="••••••••" value={formData.confirmPassword} showToggle={true} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />

                    <div className="pt-2 flex justify-end">
                        <Button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white" isLoading={changingPassword}>
                            <Save size={18} className="mr-2" /> Cập nhật mật khẩu
                        </Button>
                    </div>
                  </form>
              </div>
            )}

            {/* TAB 3: UPGRADE VIP (NEW & HIGHLIGHTED) */}
            {activeTab === "upgrade" && (
                <div className="animate-in zoom-in-50 duration-300">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Nâng cấp tài khoản</h2>
                        <p className="text-slate-500">Mở khóa toàn bộ tính năng và học tiếng Nhật nhanh gấp 2 lần</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <div className="rounded-2xl p-6 border border-slate-200 bg-white hover:border-slate-300 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-700">Thành viên cơ bản</h3>
                                    <p className="text-sm text-slate-500">Dành cho người mới bắt đầu</p>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-800 mb-6">Miễn phí</div>
                            <button disabled className="w-full py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 font-semibold text-sm mb-6">
                                Gói hiện tại
                            </button>
                            <ul className="space-y-3 text-sm text-slate-600">
                                <li className="flex gap-2"><Check size={16} className="text-emerald-500"/> Truy cập 10 bài học đầu tiên</li>
                                <li className="flex gap-2"><Check size={16} className="text-emerald-500"/> Bài tập trắc nghiệm cơ bản</li>
                                <li className="flex gap-2 text-slate-400"><Shield size={16} className="opacity-50"/> Sensei AI hỗ trợ (Giới hạn)</li>
                                <li className="flex gap-2 text-slate-400"><Shield size={16} className="opacity-50"/> Tải tài liệu PDF</li>
                            </ul>
                        </div>

                        {/* VIP Plan (Highlighted) */}
                        <div className="rounded-2xl p-6 border-2 border-orange-400 bg-orange-50/20 relative shadow-xl shadow-orange-100 transform md:-translate-y-2">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                                <Crown size={12} fill="currentColor"/> KHUYÊN DÙNG
                            </div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-orange-600">Thành viên VIP</h3>
                                    <p className="text-sm text-orange-600/70">Bứt phá mọi giới hạn</p>
                                </div>
                                <Zap size={24} className="text-orange-500 fill-orange-500 animate-pulse"/>
                            </div>
                            
                            <div className="flex items-end gap-1 mb-6">
                                <div className="text-3xl font-bold text-slate-800">99.000đ</div>
                                <div className="text-sm text-slate-500 mb-1">/tháng</div>
                            </div>

                            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-sm mb-6 shadow-lg shadow-orange-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                                <Crown size={18} fill="currentColor"/> Nâng cấp ngay
                            </button>

                            <ul className="space-y-3 text-sm text-slate-700 font-medium">
                                <li className="flex gap-2"><Check size={16} className="text-orange-500"/> <span className="text-orange-800 font-bold">Mở khóa toàn bộ 50+ bài học</span></li>
                                <li className="flex gap-2"><Check size={16} className="text-orange-500"/> Chat không giới hạn với Sensei AI</li>
                                <li className="flex gap-2"><Check size={16} className="text-orange-500"/> Chế độ luyện phát âm (Voice AI)</li>
                                <li className="flex gap-2"><Check size={16} className="text-orange-500"/> Tải xuống tài liệu PDF & Audio</li>
                                <li className="flex gap-2"><Check size={16} className="text-orange-500"/> Chứng chỉ hoàn thành khóa học</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-center gap-4 text-xs text-slate-400">
                         <span className="flex items-center gap-1"><CreditCard size={12}/> Thanh toán an toàn</span>
                         <span className="flex items-center gap-1"><Shield size={12}/> Bảo mật SSL</span>
                    </div>
                </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}