import React, { useState } from 'react';
import { User, Mail, Lock, Camera, Save, Award } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: 'Nguyễn Văn Minh',
    email: 'minh.student@example.com',
    bio: 'Đang cố gắng chinh phục N4 trong năm nay!',
    level: 'N5 - Sơ cấp',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Đã cập nhật hồ sơ thành công!');
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold text-slate-800 mb-6">
        Hồ sơ cá nhân
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT */}
        <div className="w-full md:w-80 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-emerald-500 to-green-500"></div>

            <div className="relative mt-4 mb-4">
              <div className="w-24 h-24 mx-auto bg-white rounded-full p-1 shadow-md">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover bg-slate-100"
                />
              </div>
              <button className="absolute bottom-0 right-1/2 translate-x-10 translate-y-2 p-2 bg-white rounded-full border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-600">
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

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award size={18} className="text-yellow-500" /> Thành tích
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Ngày tham gia</span>
                <span className="font-medium text-slate-700">20/01/2026</span>
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
                className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'general' ? 'Thông tin chung' : 'Bảo mật'}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'general' ? (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    icon={User}
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                  <Input
                    icon={Mail}
                    value={formData.email}
                    disabled
                    className="bg-slate-50 text-slate-500"
                  />
                </div>

                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-sm"
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
              <form onSubmit={handleSave} className="space-y-6 max-w-lg">
                <Input type="password" icon={Lock} placeholder="Mật khẩu hiện tại" />
                <Input type="password" icon={Lock} placeholder="Mật khẩu mới" />
                <Input type="password" icon={Lock} placeholder="Xác nhận mật khẩu mới" />

                <Button
                  type="submit"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  isLoading={loading}
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
