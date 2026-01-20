import React from 'react';
import { Outlet } from 'react-router-dom';

export default function InstructorLayout() {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:block">
        <div className="p-4 font-bold text-xl text-blue-600">Instructor Portal</div>
        <nav className="p-4 space-y-2">
           <div className="p-2 bg-blue-50 text-blue-600 rounded">Dashboard</div>
           <div className="p-2 text-slate-600 hover:bg-slate-50 rounded">Quản lý khóa học</div>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}