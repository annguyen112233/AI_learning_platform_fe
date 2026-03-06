import React, { useState } from 'react';
import {
  Mail, Lock, User, Key, ArrowLeft, Loader2,
  BookOpen, Sparkles, GraduationCap, Presentation
} from 'lucide-react'; // Đã thêm icon GraduationCap và Presentation
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { sendOtp, register } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    otpCode: '',
    role: 'STUDENT', // Mặc định là học viên
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);



  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const passwordRules = {
    length: (v) => v.length >= 8,
    uppercase: (v) => /[A-Z]/.test(v),
    lowercase: (v) => /[a-z]/.test(v),
    number: (v) => /[0-9]/.test(v),
    special: (v) => /[^A-Za-z0-9]/.test(v),
  };

  const getStrength = (password) => {
    let score = 0;
    Object.values(passwordRules).forEach((rule) => {
      if (rule(password)) score++;
    });
    return score; // 0 → 5
  };


  // Hàm xử lý chọn Role riêng biệt
  const handleRoleSelect = (selectedRole) => {
    setForm(prev => ({ ...prev, role: selectedRole }));
  };

  const handleSendOtp = async () => {
    if (!form.email || !form.fullName) {
      alert("Vui lòng nhập tên và email để bắt đầu bài học!");
      return;
    }
    try {
      setLoading(true);
      await sendOtp(form.email);
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      alert("Gửi OTP thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setOtpSent(false);
    setForm(prev => ({ ...prev, otpCode: '', password: '' }));
  };

  const strength = getStrength(form.password || "");

  const handleRegister = async (e) => {
    e.preventDefault();
    if ((!form.otpCode || !form.password) && getStrength(form.password) < 4) {
      toast.error("Vui lòng nhập đầy đủ thông tin!", { type: 'warning' });
      return;
    }

    try {
      setLoading(true);
      console.log("Registering with data:", form); // Kiểm tra log để thấy role
      await register(form);

      alert('Đăng ký thành công! Vui lòng đăng nhập để bắt đầu học.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4 font-sans">
      <div className="w-full max-w-md">

        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-6 bg-green-100 rounded-full mb-4 text-green-600 shadow-md border-4 border-white text-5xl">
            🐳
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Chào mừng trở lại!
          </h2>
          <p className="mt-2 text-slate-500 font-medium">
            Sẵn sàng tiếp tục bài học hôm nay chưa?
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] overflow-hidden border-2 border-slate-100">

          {/* Thanh tiến trình */}
          <div className="h-2 w-full bg-slate-100 flex">
            <div
              className={`h-full bg-green-500 transition-all duration-500 ease-out ${otpSent ? 'w-full' : 'w-1/2'}`}
            ></div>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {otpSent ? (
                  <>
                    <Sparkles className="text-yellow-400 fill-yellow-400" size={20} /> Thiết lập bảo mật
                  </>
                ) : (
                  "Tạo hồ sơ mới"
                )}
              </h2>
              {otpSent && (
                <button
                  onClick={handleBackToEmail}
                  className="text-slate-400 hover:text-green-600 transition-colors"
                  title="Quay lại"
                >
                  <ArrowLeft size={24} strokeWidth={2.5} />
                </button>
              )}
            </div>

            <form onSubmit={handleRegister} className="space-y-5">

              {!otpSent && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-300">

                  {/* --- PHẦN CHỌN ROLE --- */}
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    {/* Role: STUDENT */}
                    <div
                      onClick={() => handleRoleSelect('STUDENT')}
                      className={`cursor-pointer relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${form.role === 'STUDENT'
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-[0_4px_0_rgb(21,128,61)] translate-y-[-2px]'
                        : 'border-slate-200 bg-white text-slate-400 hover:border-green-200 hover:bg-slate-50'
                        }`}
                    >
                      <GraduationCap size={32} strokeWidth={form.role === 'STUDENT' ? 2.5 : 2} />
                      <span className="font-bold text-sm">Học viên</span>
                      {form.role === 'STUDENT' && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                      )}
                    </div>

                    {/* Role: INSTRUCTOR */}
                    <div
                      onClick={() => handleRoleSelect('INSTRUCTOR')}
                      className={`cursor-pointer relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${form.role === 'INSTRUCTOR'
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-[0_4px_0_rgb(21,128,61)] translate-y-[-2px]'
                        : 'border-slate-200 bg-white text-slate-400 hover:border-green-200 hover:bg-slate-50'
                        }`}
                    >
                      <Presentation size={32} strokeWidth={form.role === 'INSTRUCTOR' ? 2.5 : 2} />
                      <span className="font-bold text-sm">Giảng viên</span>
                    </div>
                  </div>
                  {/* --- KẾT THÚC PHẦN CHỌN ROLE --- */}

                  <Input
                    label="Họ và tên"
                    name="fullName"
                    icon={User}
                    placeholder="VD: Nguyễn Văn A"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full pl-12 bg-slate-50 border-2 border-slate-200 focus:border-green-500 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl py-3 font-medium transition-all"
                  />

                  <Input
                    label="Email liên hệ"
                    name="email"
                    type="email"
                    icon={Mail}
                    placeholder="user@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-12 bg-slate-50 border-2 border-slate-200 focus:border-green-500 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl py-3 font-medium transition-all"
                  />

                  <Button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full !bg-green-600 hover:!bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-[4px] transition-all flex justify-center items-center gap-2 uppercase tracking-wide mt-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Tiếp tục"}
                  </Button>
                </div>
              )}

              {otpSent && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-300">
                  <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-xl text-sm font-medium border border-blue-100 flex items-start gap-2">
                    <Mail size={16} className="mt-0.5 shrink-0" />
                    <span>Mã xác thực đã được gửi tới <strong>{form.email}</strong> cho tài khoản <strong>{form.role === 'STUDENT' ? 'Học viên' : 'Giảng viên'}</strong></span>
                  </div>

                  <Input
                    label="Mật khẩu"
                    name="password"
                    type="password"
                    icon={Lock}
                    placeholder="Nhập mật khẩu"
                    showToggle
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-12 bg-slate-50 border-2 border-slate-200 focus:border-green-500 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl py-3 font-medium transition-all"
                  />

                  {form.password && (
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
                        <span className={passwordRules.length(form.password) ? "text-emerald-600" : "text-slate-400"}>
                          • Ít nhất 8 ký tự
                        </span>

                        <span className={passwordRules.uppercase(form.password) ? "text-emerald-600" : "text-slate-400"}>
                          • Có chữ in hoa (A-Z)
                        </span>

                        <span className={passwordRules.lowercase(form.password) ? "text-emerald-600" : "text-slate-400"}>
                          • Có chữ thường (a-z)
                        </span>

                        <span className={passwordRules.number(form.password) ? "text-emerald-600" : "text-slate-400"}>
                          • Có số (0-9)
                        </span>

                        <span className={passwordRules.special(form.password) ? "text-emerald-600" : "text-slate-400"}>
                          • Có ký tự đặc biệt (!@#$…)
                        </span>
                      </div>
                    </div>
                  )}


                  <Input
                    label="Mã OTP"
                    name="otpCode"
                    icon={Key}
                    placeholder="Nhập 6 số"
                    value={form.otpCode}
                    onChange={handleChange}
                    className="w-full pl-12 bg-slate-50 border-2 border-slate-200 focus:border-green-500 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl py-3 font-medium transition-all"
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full !bg-green-600 hover:!bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-[4px] transition-all flex justify-center items-center gap-2 uppercase tracking-wide mt-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Hoàn tất đăng ký"}
                  </Button>
                </div>
              )}
            </form>
          </div>

          <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <p className="text-slate-500 text-sm font-medium">
              Bạn đã có tài khoản?{' '}
              <a href="/login" className="text-green-600 font-bold hover:underline">
                Đăng nhập
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}