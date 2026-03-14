import React, { useState } from 'react';
import { Mail, KeyRound, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Link } from 'react-router-dom';
import { forgotPassword } from '@/services/authService'; // Import API của bạn

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // State để chuyển đổi giao diện sau khi gửi
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Gọi API gửi mail reset password tại đây
      await forgotPassword(email);
      
      // Giả lập delay mạng để hiển thị loading
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSubmitted(true); // Chuyển sang giao diện thông báo thành công
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 font-sans p-6">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border-2 border-slate-100 relative overflow-hidden">
        
        {/* Nút Back nhỏ ở góc trên */}
        <Link 
          to="/login" 
          className="absolute top-6 left-6 text-slate-400 hover:text-green-600 transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        {/* TRẠNG THÁI 1: FORM NHẬP EMAIL */}
        {!isSubmitted ? (
          <>
            <div className="text-center mb-8 mt-4">
              <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-4 text-orange-500 shadow-sm border-4 border-white">
                <KeyRound size={32} strokeWidth={2.5} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                Quên mật khẩu?
              </h2>
              <p className="mt-2 text-slate-500 font-medium px-4">
                Đừng lo, chuyện nhỏ thôi! Nhập email để nhận hướng dẫn lấy lại mật khẩu nhé.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg text-sm font-medium flex items-center animate-pulse">
                  <span className="mr-2">⚠️</span> {error}
                </div>
              )}

              <Input
                label="Email đăng ký"
                type="email"
                placeholder="hocvien@example.com"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full pl-12 bg-slate-50 border-2 border-slate-200 focus:border-green-500 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl py-3 font-medium transition-all"
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full !bg-green-600 hover:!bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-[4px] transition-all flex justify-center items-center gap-2 uppercase tracking-wide text-lg"
              >
                {isLoading ? (
                  'Đang gửi...'
                ) : (
                  <span className="flex items-center gap-2">
                    Gửi link khôi phục <ArrowRight size={20} />
                  </span>
                )}
              </Button>

              <div className="text-center mt-6">
                <Link
                  to="/login"
                  className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          </>
        ) : (
          /* TRẠNG THÁI 2: THÔNG BÁO THÀNH CÔNG */
          <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 text-green-600 shadow-[0_0_0_8px_rgba(220,252,231,0.5)]">
              <CheckCircle2 size={40} strokeWidth={3} />
            </div>
            
            <h2 className="text-2xl font-extrabold text-slate-800 mb-3">
              Đã gửi email!
            </h2>
            
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <br/>
              <span className="font-bold text-slate-800">{email}</span>.
              <br/> Hãy kiểm tra cả hộp thư Spam nhé.
            </p>

            <div className="space-y-3">
              <Link to="/login">
                <Button className="w-full !bg-slate-800 hover:!bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_0_rgb(15,23,42)] active:shadow-none active:translate-y-[4px] transition-all">
                  Về trang đăng nhập
                </Button>
              </Link>
              
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-sm font-bold text-green-600 hover:text-green-700 py-2 hover:underline"
              >
                Thử lại với email khác
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}