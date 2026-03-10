import React, { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  Users, Search, Filter, ChevronDown, ChevronLeft, ChevronRight,
  Eye, Trash2, UserCheck, UserX, X, GraduationCap, BookOpen,
  Shield, Loader2, AlertTriangle
} from 'lucide-react';
import { getAdminUsers, toggleUserStatus, deleteAdminUser } from '@/services/adminService';

const ITEMS_PER_PAGE = 8;

// ─── Badges ───────────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const cfg = {
    STUDENT: { label: 'Học viên', Icon: GraduationCap, cls: 'bg-blue-50 text-blue-600 border-blue-100' },
    INSTRUCTOR: { label: 'Giảng viên', Icon: BookOpen, cls: 'bg-purple-50 text-purple-600 border-purple-100' },
    STAFF: { label: 'Staff', Icon: Shield, cls: 'bg-teal-50 text-teal-600 border-teal-100' },
  };
  const c = cfg[role] || cfg.STUDENT;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${c.cls}`}>
      <c.Icon size={12} strokeWidth={2.5} /> {c.label}
    </span>
  );
};

const StatusBadge = ({ enabled }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${enabled ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
    }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
    {enabled ? 'Hoạt động' : 'Vô hiệu'}
  </span>
);

// ─── Delete Modal ─────────────────────────────────────────────────────────────
const DeleteModal = ({ user, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
          <Trash2 size={22} strokeWidth={2.5} />
        </div>
        <button onClick={onCancel} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <X size={20} />
        </button>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">Xóa người dùng?</h3>
      <p className="text-sm text-slate-500 mb-6">
        Bạn có chắc muốn xóa <span className="font-bold text-slate-700">"{user.fullName}"</span>? Hành động không thể hoàn tác.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50">
          Hủy
        </button>
        <button onClick={onConfirm} disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60">
          {loading && <Loader2 size={15} className="animate-spin" />}
          Xóa
        </button>
      </div>
    </div>
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`} />
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Fetch từ BE
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getAdminUsers();
        setUsers(data || []);
      } catch (err) {
        setError('Không thể tải danh sách người dùng.');
        toast.error('Lỗi tải dữ liệu người dùng!');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Filter
  const filtered = useMemo(() => users.filter(u => {
    const matchSearch = u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchStatus = statusFilter === 'ALL'
      || (statusFilter === 'ACTIVE' && u.enabled)
      || (statusFilter === 'INACTIVE' && !u.enabled);
    return matchSearch && matchRole && matchStatus;
  }), [users, search, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Handlers
  const handleToggle = async (user) => {
    setTogglingId(user.userId);
    try {
      await toggleUserStatus(user.userId);
      setUsers(prev => prev.map(u => u.userId === user.userId ? { ...u, enabled: !u.enabled } : u));
      toast.success(`Đã ${user.enabled ? 'vô hiệu hóa' : 'kích hoạt'} "${user.fullName}"`);
    } catch {
      toast.error('Không thể thay đổi trạng thái tài khoản!');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAdminUser(deleteTarget.userId);
      setUsers(prev => prev.filter(u => u.userId !== deleteTarget.userId));
      toast.success(`Đã xóa "${deleteTarget.fullName}"`);
      setDeleteTarget(null);
    } catch {
      toast.error('Không thể xóa người dùng!');
    } finally {
      setDeleting(false);
    }
  };

  const handleFilterChange = (setter, val) => { setter(val); setPage(1); };

  // Stats
  const stats = [
    { label: 'Tổng', value: users.length, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' },
    { label: 'Học viên', value: users.filter(u => u.role === 'STUDENT').length, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Giảng viên', value: users.filter(u => u.role === 'INSTRUCTOR').length, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    { label: 'Hoạt động', value: users.filter(u => u.enabled).length, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  ];

  if (loading) return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center gap-3 text-slate-500 font-semibold">
        <Loader2 size={18} className="animate-spin text-green-600" />
        <span>Đang tải danh sách người dùng...</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20" />)}</div>
      <Skeleton className="h-14" />
      <Skeleton className="h-96" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20 text-center font-sans">
      <AlertTriangle size={48} className="text-rose-300 mb-4" />
      <h2 className="text-xl font-bold text-slate-700 mb-2">Lỗi tải dữ liệu</h2>
      <p className="text-slate-500 text-sm">{error}</p>
      <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700">Thử lại</button>
    </div>
  );

  return (
    <div className="space-y-6 font-sans text-slate-800">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Quản lý người dùng</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Dữ liệu thực từ database.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white border border-slate-100 px-4 py-2.5 rounded-xl shadow-sm">
          <Users size={16} className="text-green-600" />
          <span>{users.length} tài khoản</span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`px-5 py-4 rounded-xl border ${s.bg} ${s.border} flex items-center justify-between`}>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-extrabold mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input type="text" placeholder="Tìm theo tên, email..." value={search}
            onChange={e => handleFilterChange(setSearch, e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-50 bg-slate-50" />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select value={roleFilter} onChange={e => handleFilterChange(setRoleFilter, e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:border-green-400 appearance-none cursor-pointer">
            <option value="ALL">Tất cả vai trò</option>
            <option value="STUDENT">Học viên</option>
            <option value="INSTRUCTOR">Giảng viên</option>
            <option value="STAFF">Staff</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => handleFilterChange(setStatus, e.target.value)}
            className="pl-4 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:border-green-400 appearance-none cursor-pointer">
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Vô hiệu</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Người dùng', 'Email', 'Vai trò', 'Khóa học', 'Ngày tham gia', 'Trạng thái', 'Thao tác'].map(h => (
                  <th key={h} className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-slate-400 font-medium">
                  <Users size={40} className="mx-auto mb-3 text-slate-200" />
                  Không tìm thấy người dùng phù hợp.
                </td></tr>
              ) : paginated.map(user => (
                <tr key={user.userId} className="hover:bg-slate-50/60 transition-colors group">
                  {/* Avatar + Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.imageUrl ? (
                        <img src={user.imageUrl} alt={user.fullName} className="w-10 h-10 rounded-full object-cover border-2 border-green-200 shadow-sm flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-green-200 flex items-center justify-center text-green-700 font-bold text-sm shadow-sm flex-shrink-0">
                          {user.fullName?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-700 text-sm group-hover:text-green-700 transition-colors">{user.fullName}</p>
                        <p className="text-xs text-slate-400 font-medium">ID #{user.userId?.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">{user.email}</td>
                  <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-700">{user.courseCount}</span>
                    <span className="text-xs text-slate-400 font-medium ml-1">khóa</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}
                  </td>
                  <td className="px-6 py-4"><StatusBadge enabled={user.enabled} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => toast(`Hồ sơ: ${user.fullName}`, { icon: '👤' })} title="Xem"
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Eye size={16} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => handleToggle(user)}
                        disabled={togglingId === user.userId}
                        title={user.enabled ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        className={`p-2 rounded-lg transition-all ${user.enabled
                            ? 'text-slate-400 hover:text-orange-500 hover:bg-orange-50'
                            : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                          } disabled:opacity-40`}
                      >
                        {togglingId === user.userId
                          ? <Loader2 size={16} className="animate-spin" />
                          : user.enabled ? <UserX size={16} strokeWidth={2.5} /> : <UserCheck size={16} strokeWidth={2.5} />
                        }
                      </button>
                      <button onClick={() => setDeleteTarget(user)} title="Xóa"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <p className="text-sm text-slate-500 font-medium">
              {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} / {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${p === page ? 'bg-green-600 text-white shadow-sm' : 'border border-slate-200 text-slate-600 hover:bg-white'}`}>
                  {p}
                </button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}