import React from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Giả lập login thành công -> Chuyển hướng sang Student Dashboard
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
               {/* Logo giả lập: Chữ Nhật 'Manabu' nghĩa là Học */}
               <span className="text-2xl font-bold">学ぶ</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome Back!</h2>
            <p className="mt-2 text-slate-600">Tiếp tục hành trình chinh phục tiếng Nhật của bạn.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 mt-8">
            <Input 
              label="Email" 
              type="email" 
              placeholder="hocvien@example.com" 
              icon={Mail} 
            />
            <Input 
              label="Mật khẩu" 
              type="password" 
              placeholder="••••••••" 
              icon={Lock} 
            />
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-600 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                Ghi nhớ đăng nhập
              </label>
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Quên mật khẩu?</a>
            </div>

            <Button type="submit" className="w-full py-3 text-lg shadow-lg shadow-blue-200">
              Đăng Nhập Ngay
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Đăng ký miễn phí
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Decoration */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden items-center justify-center">
        {/* Họa tiết trang trí hình tròn (Mặt trời/Zen) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 text-white text-center p-12">
          <h1 className="text-5xl font-bold mb-6">AI Learning Platform</h1>
          <p className="text-xl text-blue-100 max-w-lg mx-auto leading-relaxed">
            "Học tập không phải là chuẩn bị cho cuộc sống; học tập chính là cuộc sống."
          </p>
          <div className="mt-8 text-6xl font-serif opacity-30">日本語</div>
        </div>
      </div>
    </div>
  );
}