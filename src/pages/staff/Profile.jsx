import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  User, Mail, Lock, Camera, Save, Phone, MapPin,
  Shield, Calendar, Check, Award, Clock
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

export default function StaffProfile() {
  const [activeTab, setActiveTab] = useState("general");
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
    role: '',
    createdAt: '',
    imageUrl: '',
    phoneNumber: "",
    address: "",
    gender: "",
    birthOfDate: "",
    handledCoursesCount: 0,
    pendingModerationCount: 0
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
        role: data.role || "",
        createdAt: data.createdAt || "",
        imageUrl: data.imageUrl || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        gender: data.gender || "",
        birthOfDate: data.birthOfDate || "",
        handledCoursesCount: data.handledCoursesCount || 0,
        pendingModerationCount: data.pendingModerationCount || 0,
      };
      setUser(mappedUser);
      setFormData((prev) => ({ ...prev, ...mappedUser, currentPassword: '', newPassword: '', confirmPassword: '' }));
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
        setFormData(prev => ({ ...prev, imageUrl: newAvatarUrl }));
        const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
        const updatedUser = { ...currentUser, imageUrl: newAvatarUrl };
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
        notes: formData.bio || formData.notes,
      };
      await updateProfile(payload);
      toast.success("Cập nhật thông tin thành công!");
      const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, ...payload };
      setUser(updatedUser);
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

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Hồ sơ nhân viên</h1>
          <p className="text-slate-500 text-sm mt-1">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-bold uppercase tracking-wider">
           Staff Member
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* LEFT COLUMN: AVATAR & STATS */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-600 to-indigo-600">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-[length:20px_20px]"></div>
            </div>

            <div className="relative mt-8 mb-4">
              <div className="w-32 h-32 mx-auto bg-white rounded-full p-1.5 shadow-xl relative ring-4 ring-white/20">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-slate-100">
                  {formData.imageUrl || previewUrl ? (
                    <img 
                      src={previewUrl || formData.imageUrl} 
                      alt="Avatar" 
                      className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? "opacity-40" : "opacity-100"}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      💼
                    </div>
                  )}
                </div>
                
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                <button 
                  type="button"
                  onClick={handleCameraClick}
                  className="absolute bottom-1 right-1 p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-full shadow-lg border border-slate-100 transition-all hover:scale-110 active:scale-95"
                >
                  <Camera size={18} />
                </button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            <h2 className="font-bold text-xl text-slate-800">{formData.fullName || "Nhân viên viên"}</h2>
            <p className="text-slate-400 text-sm mb-6">{formData.email}</p>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Ngày tham gia</p>
                <p className="text-sm font-bold text-slate-700">{formatDateVN(formData.createdAt) || "N/A"}</p>
              </div>
              <div className="text-center border-l border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Vai trò</p>
                <p className="text-sm font-bold text-slate-700">Staff</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award size={18} className="text-blue-500" /> Hoạt động công việc
            </h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Check size={16}/></div>
                     <span className="text-sm font-medium text-slate-600">Duyệt khóa học</span>
                  </div>
                   <span className="font-bold text-slate-800">{formData.handledCoursesCount}</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center"><Clock size={16}/></div>
                     <span className="text-sm font-medium text-slate-600">Đang xử lý</span>
                  </div>
                   <span className="font-bold text-slate-800">
                      {String(formData.pendingModerationCount).padStart(2, '0')}
                   </span>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: TABS & FORMS */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            {[
              { id: 'general', label: 'Thông tin chung', icon: User },
              { id: 'security', label: 'Bảo mật & Mật khẩu', icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-8 py-5 text-sm font-bold transition-all relative
                  ${activeTab === tab.id 
                    ? 'text-blue-600 bg-white' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                  }
                `}
              >
                <tab.icon size={18} /> {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 animate-in slide-in-from-left duration-300"></div>
                )}
              </button>
            ))}
          </div>

          <div className="p-8 flex-1">
            {activeTab === "general" && (
              <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Input icon={User} label="Họ và tên" placeholder="Nhập họ tên" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                  <Input icon={Mail} label="Email tài khoản" value={formData.email} disabled className="bg-slate-50 text-slate-400 cursor-not-allowed" />
                  <Input icon={Phone} label="Số điện thoại" placeholder="09xxxxxxx" value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
                  <Input icon={MapPin} label="Địa chỉ" placeholder="Nhập địa chỉ" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1">Giới tính</label>
                    <select 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-medium" 
                      value={formData.gender} 
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    >
                      <option value="">-- Chọn giới tính --</option>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2"><Calendar size={14}/> Ngày sinh</label>
                    <DatePicker
                      locale="vi"
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Chọn ngày sinh"
                      selected={formData.birthOfDate ? new Date(formData.birthOfDate) : null}
                      onChange={(date) => setFormData({...formData, birthOfDate: date ? date.toISOString().slice(0, 10) : ""})}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                      maxDate={new Date()}
                      showMonthDropdown showYearDropdown dropdownMode="select"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 pt-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Mô tả/Ghi chú công việc</label>
                  <textarea 
                    rows={4} 
                    placeholder="Lĩnh vực chuyên môn hoặc ghi chú thêm..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                    value={formData.bio || formData.notes}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  />
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100 px-8" isLoading={loading}>
                    <Save size={18} className="mr-2" /> Lưu thông tin
                  </Button>
                </div>
              </form>
            )}

            {activeTab === "security" && (
              <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4 items-start">
                   <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Shield size={20}/></div>
                   <div>
                      <p className="text-sm font-bold text-amber-800">Cải thiện độ bảo mật</p>
                      <p className="text-xs text-amber-600 mt-1 italic">Vui lòng thay đổi mật khẩu định kỳ và không sử dụng chung mật khẩu với các nền tảng khác.</p>
                   </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-6">
                  <Input type="password" icon={Lock} label="Mật khẩu hiện tại" placeholder="••••••••" value={formData.currentPassword} showToggle={true} onChange={(e) => setFormData({...formData, currentPassword: e.target.value})} />
                  
                  <div>
                    <Input type="password" icon={Lock} label="Mật khẩu mới" placeholder="••••••••" value={formData.newPassword} showToggle={true} onChange={(e) => setFormData({...formData, newPassword: e.target.value})} />
                    {formData.newPassword && (
                      <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Độ mạnh mật khẩu</span>
                          <span className={`text-xs font-bold ${strength >= 4 ? "text-emerald-600" : strength >= 2 ? "text-amber-500" : "text-rose-500"}`}>
                            {strength >= 4 ? "Mạnh" : strength >= 2 ? "Trung bình" : "Yếu"}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-4">
                           <div className={`h-full transition-all duration-500 ${strength >= 4 ? "bg-emerald-500" : strength >= 2 ? "bg-amber-400" : "bg-rose-500"}`} style={{ width: `${(strength / 5) * 100}%` }} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          {Object.keys(passwordRules).map((key) => (
                            <div key={key} className={`flex items-center gap-2 text-[10px] font-medium ${passwordRules[key](formData.newPassword) ? "text-emerald-600" : "text-slate-400"}`}>
                              <div className={`w-1 h-1 rounded-full ${passwordRules[key](formData.newPassword) ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300"}`}></div>
                              {key === 'length' && 'Ít nhất 8 ký tự'}
                              {key === 'uppercase' && 'Chữ in hoa'}
                              {key === 'lowercase' && 'Chữ thường'}
                              {key === 'number' && 'Chữ số'}
                              {key === 'special' && 'Ký tự đặc biệt'}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Input type="password" icon={Lock} label="Xác nhận mật khẩu mới" placeholder="••••••••" value={formData.confirmPassword} showToggle={true} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} />

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white px-8" isLoading={changingPassword}>
                      <Save size={18} className="mr-2" /> Đổi mật khẩu
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
