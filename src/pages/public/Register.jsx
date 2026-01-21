import React, { useState } from 'react';
import { Mail, Lock, User, Key } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { sendOtp, register } from '@/services/authService';

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    otpCode: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
  try {
    setLoading(true);

    await sendOtp(form.email); // ✅ FIX 1
    setOtpSent(true);          // ✅ FIX 2

    alert("OTP đã được gửi");
  } catch (err) {
    console.error(err);
    alert("Gửi OTP thất bại");
  } finally {
    setLoading(false);
  }
};



  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register(form);
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
    } catch (err) {
      alert(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">Đăng ký tài khoản</h2>

        <Input
          label="Họ và tên"
          name="fullName"
          icon={User}
          value={form.fullName}
          onChange={handleChange}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          icon={Mail}
          value={form.email}
          onChange={handleChange}
        />

        {!otpSent && (
          <Button type="button" onClick={handleSendOtp} disabled={loading}>
            Gửi OTP
          </Button>
        )}

        {otpSent && (
          <>
            <Input
              label="Mật khẩu"
              name="password"
              type="password"
              icon={Lock}
              value={form.password}
              onChange={handleChange}
            />

            <Input
              label="OTP"
              name="otpCode"
              icon={Key}
              value={form.otpCode}
              onChange={handleChange}
            />

            <Button type="submit" disabled={loading}>
              Đăng ký
            </Button>
          </>
        )}
      </form>
    </div>
  );
}
