import React, { useState } from 'react';
import { User, Mail, Lock, Camera, Save, MapPin, Flag, Award, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function StudentProfile() {
    const [activeTab, setActiveTab] = useState('general'); // 'general' hoặc 'security'
    const [loading, setLoading] = useState(false);

    // Mock Data
    const [formData, setFormData] = useState({
        fullName: 'Nguyễn Văn Minh',
        email: 'minh.student@example.com',
        bio: 'Đang cố gắng chinh phục N4 trong năm nay!',
        level: 'N5 - Sơ cấp',
        goal: 'Giao tiếp cơ bản',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);
        // Giả lập gọi API
        setTimeout(() => {
            setLoading(false);
            alert('Đã cập nhật hồ sơ thành công!');
        }, 1000);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Hồ sơ cá nhân</h1>

            <div className="flex flex-col md:flex-row gap-8">

                {/* LEFT COLUMN: AVATAR & STATS */}
                <div className="w-full md:w-80 shrink-0 space-y-6">
                    {/* Avatar Card */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-blue-500 to-cyan-500"></div>

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

                        <h2 className="font-bold text-lg text-slate-800">{formData.fullName}</h2>
                        <p className="text-slate-500 text-sm mb-4">Học viên</p>

                        <div className="flex justify-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                                {formData.level}
                            </span>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Award size={18} className="text-yellow-500" /> Thành tích
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Ngày tham gia</span>
                                <span className="font-medium text-slate-700">20/01/2026</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Khóa học đã xong</span>
                                <span className="font-medium text-slate-700">1</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Tổng giờ học</span>
                                <span className="font-medium text-slate-700">24h 30p</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: EDIT FORM */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-slate-100">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'general' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            Thông tin chung
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'security' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            Bảo mật
                        </button>
                    </div>

                    <div className="p-8">
                        {activeTab === 'general' ? (
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Họ và tên</label>
                                        <Input
                                            icon={User}
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Email</label>
                                        <Input
                                            icon={Mail}
                                            value={formData.email}
                                            disabled
                                            className="w-full pl-10 bg-slate-50 text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Giới thiệu bản thân & Mục tiêu</label>
                                    <textarea
                                        rows={4}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                    <p className="text-xs text-slate-400 text-right">0/200 ký tự</p>
                                </div>

                                <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                                    <Button type="submit" className="flex items-center gap-2" isLoading={loading}>
                                        <Save size={18} /> Lưu thay đổi
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleSave} className="space-y-6 max-w-lg">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Mật khẩu hiện tại</label>
                                    <Input type="password" icon={Lock} placeholder="********" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Mật khẩu mới</label>
                                    <Input type="password" icon={Lock} placeholder="Nhập mật khẩu mới" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Xác nhận mật khẩu mới</label>
                                    <Input type="password" icon={Lock} placeholder="Nhập lại mật khẩu mới" />
                                </div>

                                <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                                    <Button type="submit" className="flex items-center gap-2" isLoading={loading}>
                                        <Save size={18} /> Đổi mật khẩu
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}