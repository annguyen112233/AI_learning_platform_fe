import React, { useState } from 'react';
import { Mail, Lock, BookOpen, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/services/authService';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from "@/context/AuthContext";
import { getProfile } from '@/services/userService';



export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuth();


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
      const data = res.data?.data || res.data;

      const accessToken = data.accessToken;

      // ✅ CHỈ lưu access token
      sessionStorage.setItem('accessToken', accessToken);
      const profileRes = await getProfile();
      console.log('Profile:', profileRes);
      setUser(profileRes.data.data);

      // ✅ Decode JWT để lấy role
      const decoded = jwtDecode(accessToken);
      const role = decoded.role;

      console.log('ROLE:', role);

      // ✅ Redirect theo role
      switch (role) {
        case 'STUDENT':
          navigate('/student/dashboard');
          break;

        case 'INSTRUCTOR':
          navigate('/instructor/dashboard');
          break;

        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'STAFF':
          navigate('/staff/dashboard');
          break;

        default:
          setError('Role không hợp lệ');
          sessionStorage.clear();
      }

    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        'Đăng nhập thất bại. Vui lòng kiểm tra lại.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 font-sans p-6">

      {/* FORM LOGIN */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 border-2 border-slate-100">

        {/* Logo Brand */}
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


        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg text-sm font-medium flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="hocvien@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full pl-12 bg-slate-50 border-2 border-slate-200 focus:border-green-500 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl py-3 font-medium transition-all"
            />

            <Input
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              value={password}
              showToggle={true}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full pl-12 bg-slate-50 border-2 border-slate-200 focus:border-green-500 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl py-3 font-medium transition-all"
            />

          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm font-medium text-slate-600 cursor-pointer select-none"
              >
                Ghi nhớ tôi
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-bold text-green-600 hover:text-green-700 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full !bg-green-600 hover:!bg-green-700 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-[4px] transition-all flex justify-center items-center gap-2 uppercase tracking-wide text-lg"
          >
            {isLoading ? (
              'Đang xử lý...'
            ) : (
              <span className="flex items-center gap-2">
                Đăng nhập ngay <ArrowRight size={20} />
              </span>
            )}
          </Button>

          <div className="text-center text-sm font-medium text-slate-500 mt-6 pt-6 border-t border-slate-100">
            Bạn chưa có tài khoản?
            <Link
              to="/register"
              className="font-bold text-green-600 hover:text-green-700 hover:underline ml-1"
            >
              Đăng ký miễn phí
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
