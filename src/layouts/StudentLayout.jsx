import React, { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { logout } from "@/services/authService"

import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  User,
  LogOut,
  Bell,
  Settings,
  Award,
  FileText,
  Menu,
  X,
  ChevronLeft,
} from 'lucide-react';

export default function StudentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { subscription } = useSubscription();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Tổng quan", path: "/student/dashboard" },
    { icon: BookOpen,        label: "Khóa học",  path: "/student/courses" },
    { icon: FileText,        label: "Thi thử",   path: "/student/mock-test" },
    { icon: Award,           label: "Thành tích",path: "/student/achievements" },
    { icon: MessageSquare,   label: "Trợ lý AI", path: "/student/chat" },
    { icon: User,            label: "Hồ sơ",     path: "/student/profile" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.warn("Logout failed (token may already be expired)", err);
    } finally {
      sessionStorage.clear();
      setUser(null);
      navigate("/login");
    }
  };

  const handleGoProfile = () => navigate("/student/profile");

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">

      {/* ══ SIDEBAR ══ */}
      <aside
        style={{
          width: sidebarOpen ? 288 : 72,
          minWidth: sidebarOpen ? 288 : 72,
          transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden',
          position: 'fixed',
          height: '100%',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          borderRight: '1px solid #f1f5f9',
          boxShadow: '4px 0 24px rgba(0,0,0,0.04)',
        }}
      >
        {/* Logo + toggle button */}
        <div
          style={{
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: sidebarOpen ? '0 24px' : '0 16px',
            borderBottom: '1px solid #f8fafc',
            gap: 8,
            transition: 'padding 0.3s',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', flex: 1 }}>
            <div style={{
              width: 40, height: 40, minWidth: 40,
              background: '#dcfce7', borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0,
              boxShadow: '0 2px 8px rgba(22,163,74,0.12)',
            }}>
              🐳
            </div>
            <span style={{
              fontWeight: 900, fontSize: 17, color: '#15803d',
              whiteSpace: 'nowrap',
              opacity: sidebarOpen ? 1 : 0,
              transform: sidebarOpen ? 'translateX(0)' : 'translateX(-8px)',
              transition: 'opacity 0.2s, transform 0.25s',
              pointerEvents: sidebarOpen ? 'auto' : 'none',
            }}>
              SABO Academy
            </span>
          </div>

          {/* Collapse / Expand button */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            title={sidebarOpen ? 'Thu gọn sidebar' : 'Mở rộng sidebar'}
            style={{
              width: 32, height: 32, minWidth: 32,
              borderRadius: 8,
              border: 'none',
              background: sidebarOpen ? '#f1f5f9' : '#dcfce7',
              color: sidebarOpen ? '#64748b' : '#15803d',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#dcfce7';
              e.currentTarget.style.color = '#15803d';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = sidebarOpen ? '#f1f5f9' : '#dcfce7';
              e.currentTarget.style.color = sidebarOpen ? '#64748b' : '#15803d';
            }}
          >
            <svg
              width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              style={{
                minWidth: '18px', minHeight: '18px', display: 'block', flexShrink: 0,
                transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: sidebarOpen ? '24px 16px' : '24px 8px', overflowY: 'auto', transition: 'padding 0.3s' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {sidebarItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                title={!sidebarOpen ? item.label : undefined}
                className={({ isActive }) =>
                  `group flex items-center rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-green-50 text-green-700 font-bold shadow-sm'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-green-600 font-medium'
                  }`
                }
                style={{
                  gap: sidebarOpen ? 12 : 0,
                  padding: sidebarOpen ? '11px 16px' : '11px',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  transition: 'all 0.3s',
                }}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={22}
                      strokeWidth={isActive ? 2.5 : 2}
                      style={{ flexShrink: 0, color: isActive ? '#16a34a' : undefined }}
                    />
                    <span style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      opacity: sidebarOpen ? 1 : 0,
                      maxWidth: sidebarOpen ? 200 : 0,
                      transition: 'opacity 0.2s, max-width 0.25s',
                      display: 'block',
                    }}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: sidebarOpen ? '16px' : '16px 8px', borderTop: '1px solid #f8fafc', display: 'flex', flexDirection: 'column', gap: 8, transition: 'padding 0.3s' }}>

          {/* Cài đặt */}
          <button
            title={!sidebarOpen ? 'Cài đặt' : undefined}
            style={{
              display: 'flex', alignItems: 'center',
              gap: sidebarOpen ? 12 : 0,
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              padding: sidebarOpen ? '11px 16px' : '11px',
              background: '#dcfce7', color: '#166534',
              borderRadius: 12, border: 'none',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
              transition: 'all 0.3s',
              width: '100%',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#bbf7d0'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#dcfce7'; }}
          >
            <Settings size={22} style={{ flexShrink: 0 }} />
            <span style={{
              whiteSpace: 'nowrap', overflow: 'hidden',
              opacity: sidebarOpen ? 1 : 0,
              maxWidth: sidebarOpen ? 200 : 0,
              transition: 'opacity 0.2s, max-width 0.25s',
            }}>
              Cài đặt
            </span>
          </button>

          {/* Đăng xuất */}
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Đăng xuất' : undefined}
            style={{
              display: 'flex', alignItems: 'center',
              gap: sidebarOpen ? 12 : 0,
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              padding: sidebarOpen ? '11px 16px' : '11px',
              background: '#16a34a', color: 'white',
              borderRadius: 12, border: 'none',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
              transition: 'all 0.3s',
              width: '100%',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#15803d'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#16a34a'; }}
          >
            <LogOut size={22} style={{ flexShrink: 0 }} />
            <span style={{
              whiteSpace: 'nowrap', overflow: 'hidden',
              opacity: sidebarOpen ? 1 : 0,
              maxWidth: sidebarOpen ? 200 : 0,
              transition: 'opacity 0.2s, max-width 0.25s',
            }}>
              Đăng xuất
            </span>
          </button>
        </div>
      </aside>

      {/* ══ MAIN CONTENT ══ */}
      <div
        style={{
          marginLeft: sidebarOpen ? 288 : 72,
          transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* TOP BAR */}
        <header
          style={{
            height: 80,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 20,
          }}
        >

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* Notification */}
            <button style={{
              position: 'relative', padding: 8,
              background: 'none', border: 'none',
              color: '#94a3b8', cursor: 'pointer',
              borderRadius: '50%', transition: 'background 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
            >
              <Bell size={22} />
              <span style={{
                position: 'absolute', top: 8, right: 10,
                width: 10, height: 10,
                background: '#f43f5e', borderRadius: '50%',
                border: '2px solid white',
              }} />
            </button>

            <div style={{ height: 32, width: 1, background: '#e2e8f0' }} />

            {/* User Profile */}
            <div
              onClick={handleGoProfile}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                cursor: 'pointer', padding: '6px 12px 6px 6px',
                borderRadius: 999, border: '1px solid transparent',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'transparent'; }}
            >
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt="Avatar"
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #bbf7d0' }}
                />
              ) : (
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: '#dcfce7', border: '2px solid #bbf7d0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 'bold', fontSize: 18, color: '#15803d',
                }}>
                  {(user?.fullName || 'U')[0].toUpperCase()}
                </div>
              )}
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#334155', lineHeight: 1.2 }}>
                  {user?.fullName || 'Học viên'}
                </p>
                <div style={{ display: 'flex', gap: 6, marginTop: 2, alignItems: 'center' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: '#16a34a',
                    background: '#f0fdf4', padding: '2px 6px', borderRadius: 4,
                    textTransform: 'uppercase',
                  }}>
                    {user?.level || 'N5'}
                  </span>
                  {subscription?.active === 'ACTIVE' && (
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      padding: '2px 6px', borderRadius: 4,
                      textTransform: 'uppercase',
                      background: subscription.plan === 'PREMIUM'   ? '#fef3c7' :
                                  subscription.plan === 'ENTERPRISE'? '#f3e8ff' : '#f1f5f9',
                      color:      subscription.plan === 'PREMIUM'   ? '#92400e' :
                                  subscription.plan === 'ENTERPRISE'? '#7c3aed' : '#475569',
                    }}>
                      {subscription.plan}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#f8fafc' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
