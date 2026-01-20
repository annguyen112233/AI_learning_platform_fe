import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, MessageSquare, User, LogOut, Bell, Search } from 'lucide-react';

export default function StudentLayout() {
  const location = useLocation();

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Tổng quan", path: "/student/dashboard" },
    { icon: BookOpen, label: "Khóa học của tôi", path: "/student/courses" },
    { icon: MessageSquare, label: "AI Tutor Chat", path: "/student/chat" },
    { icon: User, label: "Hồ sơ", path: "/student/profile" },
  ];

  // Map tiêu đề trang dựa trên URL hiện tại (Optional - để hiển thị breadcrumb nếu thích)
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Tổng quan';
    if (path.includes('courses')) return 'Khóa học của tôi';
    if (path.includes('chat')) return 'Trợ lý AI';
    if (path.includes('profile')) return 'Hồ sơ cá nhân';
    return '';
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-20">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">JP</div>
          <span className="text-xl font-bold text-slate-800">NihongoAI</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? "bg-blue-50 text-blue-600 shadow-sm" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-all font-medium">
            <LogOut size={20} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        
        {/* TOP BAR: Gọn gàng, cố định ở trên cùng */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
           {/* Breadcrumb / Title nhỏ */}
           <div className="text-sm font-medium text-slate-500">
              Student Space <span className="mx-2">/</span> <span className="text-slate-800">{getPageTitle()}</span>
           </div>

           {/* Right Actions */}
           <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full relative">
                 <Bell size={20} />
                 <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              
              <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>

              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="text-right hidden md:block">
                   <p className="text-sm font-bold text-slate-700">Minh Student</p>
                   <p className="text-xs text-slate-500">Học viên N5</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-blue-600 font-bold">
                  M
                </div>
              </div>
           </div>
        </header>

        {/* Nội dung chính cuộn bên dưới TopBar */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-8">
           <Outlet />
        </main>
      </div>
    </div>
  );
}