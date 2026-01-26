import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
// import { resetPassword } from '@/services/authService'; // API của bạn

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook để lấy token từ URL
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Lấy token từ URL (ví dụ: domain.com/reset-password?token=ABC...)
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Đường dẫn không hợp lệ hoặc đã hết hạn.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Validate cơ bản ở Client
    if (password.length < 6) {
      setError('Mật khẩu cần ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (!token) {
        setError('Thiếu mã xác thực (Token). Vui lòng kiểm tra lại link trong email.');
        return;
    }

    setIsLoading(true);

    try {
      // 2. Gọi API
      // await resetPassword({ token, newPassword: password });
      
      // Giả lập delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể đổi mật khẩu. Link có thể đã hết hạn.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 font-sans p-6">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border-2 border-slate-100 relative">
        
        {/* TRẠNG THÁI THÀNH CÔNG */}
        {isSuccess ? (
          <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
             <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 text-green-600 shadow-[0_0_0_8px_rgba(220,252,231,0.5)]">
               <ShieldCheck size={40} strokeWidth={2.5} />
             </div>
             
             <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
               Đổi mật khẩu thành công!
             </h2>
             <p className="text-slate-500 font-medium mb-8">
               Tài khoản của bạn đã được bảo vệ an toàn. <br/>
               Hãy đăng nhập ngay nhé.
             </p>

             <Link to="/login">
               <Button className="w-full !bg-green-600 hover:!bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-[4px] transition-all flex justify-center items-center gap-2 uppercase tracking-wide">
                 Về trang đăng nhập <ArrowRight size={20} />
               </Button>
             </Link>
          </div>
        ) : (
          /* TRẠNG THÁI NHẬP FORM */
          <>
            <div className="text-center mb-8">
              {/* Icon Ổ khóa màu tím để khác biệt với Login/Register */}
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4 text-indigo-600 shadow-sm border-4 border-white">
                <Lock size={32} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                Đặt lại mật khẩu mới
              </h2>
              <p className="mt-2 text-slate-500 font-medium text-sm">
                Hãy chọn một mật khẩu đủ mạnh và dễ nhớ với bạn nhé.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg text-sm font-medium flex items-start animate-shake">
                  <span className="mr-2 mt-0.5">⚠️</span> 
                  <span>{error}</span>
                </div>
              )}

              <Input
                label="Mật khẩu mới"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full pl-12 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl py-3 font-medium transition-all"
              />

              <Input
                label="Xác nhận mật khẩu"
                type="password"
                placeholder="••••••••"
                icon={CheckCircle2}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                // Thêm viền đỏ nếu nhập không khớp
                className={`w-full pl-12 bg-slate-50 border-2 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl py-3 font-medium transition-all
                  ${confirmPassword && password !== confirmPassword 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-slate-200 focus:border-indigo-500'
                  }`}
              />
              
              {/* Gợi ý mật khẩu khớp */}
              {password && confirmPassword && password === confirmPassword && (
                 <div className="text-xs text-green-600 font-bold flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                   <CheckCircle2 size={12} /> Mật khẩu đã khớp
                 </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !!error}
                className="w-full mt-4 !bg-slate-800 hover:!bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_0_rgb(15,23,42)] active:shadow-none active:translate-y-[4px] transition-all flex justify-center items-center gap-2 text-lg"
              >
                {isLoading ? 'Đang cập nhật...' : 'Lưu mật khẩu'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}