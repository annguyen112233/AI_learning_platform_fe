import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/services/authService";

import {
  LayoutDashboard,
  ClipboardCheck, 
  Flag,           
  MessageSquare,  
  LogOut,
  Bell,
  Settings,
  Shield,
  BookOpen
} from 'lucide-react';

export default function StaffLayout() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  // 👇 MENU DÀNH RIÊNG CHO STAFF (OPERATIONS)
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/staff/dashboard" },
    { icon: ClipboardCheck, label: "Kiểm duyệt nội dung", path: "/staff/moderation" }, 
    { icon: Flag, label: "Xử lý báo cáo", path: "/staff/reports" }, 
    { icon: MessageSquare, label: "Q&A & Bình luận", path: "/staff/discussions" }, 
    { icon: BookOpen, label: "Ngân hàng Placement Test", path: "/staff/placement-docs" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.warn("Logout failed", err);
    } finally {
      sessionStorage.clear();
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col fixed h-full z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">

        {/* Logo - Đã đổi về Green chuẩn */}
        <div className="h-20 flex items-center gap-3 px-8 border-b border-slate-50">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shadow-sm text-2xl">
            🐳
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-green-700 tracking-tight">
              SABO Staff
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Content Operation
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                  ? "bg-green-50 text-green-700 font-bold shadow-sm translate-x-1" // ✅ Active: Green
                  : "text-slate-500 hover:bg-slate-50 hover:text-green-600 font-medium hover:translate-x-1" // ✅ Hover: Green
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={
                      isActive
                        ? "text-green-600" // ✅ Icon Active: Green
                        : "text-slate-400 group-hover:text-green-500" // ✅ Icon Hover: Green
                    }
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-slate-50 space-y-2">
          {/* Cài đặt */}
          <button className="flex items-center gap-3 px-4 py-3 bg-slate-100 text-slate-600 hover:bg-slate-200 w-full rounded-xl transition-all font-semibold group">
            <Settings size={22} className="group-hover:rotate-90 transition-transform duration-300"/>
            <span>Cài đặt</span>
          </button>

          {/* Đăng xuất - Nút Xanh lá */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 bg-green-600 text-white hover:bg-green-700 hover:shadow-md w-full rounded-xl transition-all font-bold group"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform"/>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-72 flex flex-col h-screen overflow-hidden relative">

        {/* TOP BAR */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-end px-8 sticky top-0 z-20">
          <div className="flex items-center gap-6">

            {/* Notification */}
            <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-[1px] bg-slate-200"></div>

            {/* Staff Profile */}
            <div className="flex items-center gap-3">
              {/* Avatar - Viền Xanh lá */}
              <div className="w-10 h-10 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center text-green-700 font-bold text-lg shadow-sm">
                S
              </div>

              {/* Name + Role Badge */}
              <div className="hidden md:block">
                <p className="text-sm font-bold text-slate-700 leading-tight">
                  {user?.fullName || "Staff Member"}
                </p>
                {/* Badge Role: MODERATOR - Màu Xanh lá */}
                <p className="text-[10px] uppercase font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded w-fit mt-0.5 border border-green-100">
                  MODERATOR
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto pb-10">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}