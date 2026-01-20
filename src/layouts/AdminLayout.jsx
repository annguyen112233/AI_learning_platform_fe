import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-slate-900 text-white hidden md:block">
        <div className="p-4 font-bold text-xl">Admin Center</div>
        <nav className="p-4 space-y-2">
           <div className="p-2 bg-slate-800 text-white rounded">Dashboard</div>
           <div className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded">Users</div>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}