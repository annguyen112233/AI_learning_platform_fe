import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X } from 'lucide-react';
import CourseManager from './CourseManager';
import CreateCourse from './CreateCourse';

/**
 * Trang /instructor/courses
 * Tái sử dụng CourseManager (đã có modal xem modules, thêm module, gửi duyệt).
 * Thêm nút "Tạo khóa học mới" và modal CreateCourse.
 */
export default function InstructorCourses() {
    const [showCreate, setShowCreate] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const handleCreated = () => {
        setShowCreate(false);
        setReloadKey(k => k + 1);
    };

    return (
        <div className="space-y-6 font-sans text-slate-800">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Khóa học của tôi</h1>
                    <p className="text-slate-500 mt-0.5 text-sm font-medium">
                        Quản lý khóa học, thêm module, gửi duyệt và theo dõi trạng thái.
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all">
                    <Plus size={17} /> Tạo khóa học mới
                </button>
            </div>

            {/* INFO BANNER */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 text-sm text-blue-700 font-medium">
                💡 <strong>Hướng dẫn:</strong> Nhấn <strong>"Xem Modules"</strong> để xem/thêm module, nhấn module để quản lý bài học.
                Khi đủ <strong>3 modules</strong>, nhấn <strong>"Gửi duyệt"</strong> để chuyển khóa học lên STAFF xét duyệt.
            </div>

            {/* COURSE MANAGER — Component đã có sẵn với đầy đủ chức năng */}
            <CourseManager key={reloadKey} reloadKey={reloadKey} />

            {/* CREATE COURSE MODAL */}
            {showCreate && createPortal(
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Plus size={22} className="text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Tạo Khóa học mới</h3>
                            </div>
                            <button onClick={() => setShowCreate(false)}
                                className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors">
                                <X size={20} className="text-white" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                            <CreateCourse onCreated={handleCreated} />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
