import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/services/authService";

import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  User,
  LogOut,
  Bell,
  Settings,
} from "lucide-react";

export default function InstructorLayout() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const sidebarItems = [
    {
      icon: LayoutDashboard,
      label: "Tổng quan",
      path: "/instructor/dashboard",
    },
    { icon: BookOpen, label: "Khóa học", path: "/instructor/courses" },
    { icon: Users, label: "Học viên", path: "/instructor/students" },
    { icon: BarChart3, label: "Thống kê", path: "/instructor/analytics" },
    { icon: User, label: "Hồ sơ", path: "/instructor/profile" },
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

  const handleGoProfile = () => {
    navigate("/instructor/profile");
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col fixed h-full z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Logo */}
        <div className="h-20 flex items-center gap-3 px-8 border-b border-slate-50">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm text-2xl">
            🎓
          </div>
          <span className="text-xl font-extrabold text-blue-700 tracking-tight">
            SABO Instructor
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-bold shadow-sm translate-x-1"
                    : "text-slate-500 hover:bg-slate-50 hover:text-blue-600 font-medium hover:translate-x-1"
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
                        ? "text-blue-600"
                        : "text-slate-400 group-hover:text-blue-500"
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
          {/* Settings */}
          <button
            className="
              flex items-center gap-3 px-4 py-3
              bg-blue-100 text-blue-800
              hover:bg-blue-200 hover:shadow-sm
              w-full rounded-xl transition-all font-semibold
              group
            "
          >
            <Settings
              size={22}
              className="text-blue-700 group-hover:rotate-90 transition-transform duration-300"
            />
            <span>Cài đặt</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-3 px-4 py-3
              bg-blue-600 text-white
              hover:bg-blue-700 hover:shadow-md
              w-full rounded-xl transition-all font-bold
              group
            "
          >
            <LogOut
              size={22}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 ml-72 flex flex-col h-screen overflow-hidden">
        {/* TOP BAR */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-end px-8 sticky top-0 z-20">
          <div className="flex items-center gap-6">
            {/* Notification */}
            <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-[1px] bg-slate-200"></div>

            {/* User */}
            <div
              onClick={handleGoProfile}
              className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-all"
            >
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-200 shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg shadow-sm">
                  {(user?.fullName || "I")[0].toUpperCase()}
                </div>
              )}

              <div className="hidden md:block">
                <p className="text-sm font-bold text-slate-700 leading-tight">
                  {user?.fullName || "Instructor"}
                </p>
                <p className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded w-fit mt-0.5">
                  INSTRUCTOR
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-8">
          <div className="max-w-6xl mx-auto pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
