import React from 'react';
import toast from 'react-hot-toast'; // Import thư viện thông báo
import { 
  Users, 
  BookOpen, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight,
  Eye,
  Calendar,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react';

export default function AdminDashboard() {
  
  // 1. Mock Data: Số liệu thống kê
  const stats = [
    { 
      label: 'Chờ duyệt', 
      value: '12', 
      desc: 'Khóa học đang đợi', 
      icon: <Clock size={24} />, 
      bgIcon: 'bg-orange-50', 
      textIcon: 'text-orange-600',
      trend: '+2 hôm nay'
    },
    { 
      label: 'Tổng người dùng', 
      value: '2,450', 
      desc: 'Học viên & Giảng viên', 
      icon: <Users size={24} />, 
      bgIcon: 'bg-blue-50', 
      textIcon: 'text-blue-600',
      trend: '+15% tháng này'
    },
    { 
      label: 'Tổng khóa học', 
      value: '185', 
      desc: 'Đã public trên hệ thống', 
      icon: <BookOpen size={24} />, 
      bgIcon: 'bg-emerald-50', 
      textIcon: 'text-emerald-600',
      trend: '+5 khóa mới'
    },
    { 
      label: 'Báo cáo vi phạm', 
      value: '3', 
      desc: 'Cần xem xét ngay', 
      icon: <AlertTriangle size={24} />, 
      bgIcon: 'bg-rose-50', 
      textIcon: 'text-rose-600',
      trend: 'Nghiêm trọng'
    },
  ];

  // 2. Mock Data: Danh sách khóa học TIẾNG NHẬT chờ duyệt
  const pendingCourses = [
    {
      id: 101,
      title: 'Minna no Nihongo I - N5 Cấp tốc',
      instructor: 'Yamada Akira',
      category: 'Sơ cấp N5',
      submittedDate: '29/01/2026',
      status: 'Pending',
      thumbnail: 'MN'
    },
    {
      id: 102,
      title: 'Luyện thi JLPT N4 - Ngữ pháp & Đọc hiểu',
      instructor: 'Nguyễn Thanh Hương',
      category: 'Sơ cấp N4',
      submittedDate: '28/01/2026',
      status: 'Pending',
      thumbnail: 'N4'
    },
    {
      id: 103,
      title: 'Kaiwa thực chiến: Giao tiếp công sở',
      instructor: 'Sato Kenji',
      category: 'Giao tiếp (Kaiwa)',
      submittedDate: '28/01/2026',
      status: 'Pending',
      thumbnail: 'KW'
    },
    {
      id: 104,
      title: 'Hán tự (Kanji) N3 qua hình ảnh',
      instructor: 'Trần Văn Bình',
      category: 'Trung cấp N3',
      submittedDate: '27/01/2026',
      status: 'Pending',
      thumbnail: 'K3'
    },
  ];

 

  const handleReject = (title) => {
    toast.error(`Đã từ chối khóa học: ${title}`, {
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
    });
  };

  const handleView = (title) => {
    toast(`Đang xem chi tiết: ${title}`, {
        icon: '👀',
    });
  };

  return (
    <div className="space-y-8 font-sans text-slate-800">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-slate-500 mt-1 font-medium">Chào mừng Admin, kiểm tra các hoạt động mới nhất.</p>
        </div>
        
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm">
            <Calendar size={18} className="text-green-600"/>
            <span>Hôm nay: 29/01/2026</span>
        </div>
      </div>

      {/* STATS CARDS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-slate-800 mt-2">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgIcon} ${stat.textIcon}`}>
                {stat.icon}
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-emerald-600 flex items-center font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    <ArrowUpRight size={16} className="mr-1"/> {stat.trend}
                </span>
                <span className="text-slate-400 font-medium text-xs">{stat.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* --- ACTION TABLE SECTION (ĐÃ LÀM MỚI) --- */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
        
        {/* Table Header: Gradient Xanh lá nhẹ */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-green-50/60 via-transparent to-transparent">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                    <BookOpen size={20} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-lg text-slate-800">Yêu cầu phê duyệt</h2>
                        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-extrabold border border-orange-200">
                            {pendingCourses.length} mới
                        </span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mt-0.5">Danh sách khóa học giảng viên vừa gửi lên.</p>
                </div>
            </div>

            <button className="text-sm font-bold text-slate-600 hover:text-green-700 hover:bg-white bg-white/50 border border-slate-200 px-4 py-2 rounded-lg transition-all shadow-sm">
                Xem toàn bộ
            </button>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase font-bold tracking-wider">
                    <tr>
                        <th className="p-5 pl-8">Khóa học</th>
                        <th className="p-5">Giảng viên</th>
                        <th className="p-5">Cấp độ / Loại</th>
                        <th className="p-5">Ngày gửi</th>
                        <th className="p-5">Trạng thái</th>
                        <th className="p-5 text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {pendingCourses.map((course) => (
                        <tr key={course.id} className="hover:bg-slate-50/60 transition-colors group">
                            
                            {/* Cột 1: Tên Khóa học */}
                            <td className="p-5 pl-8">
                                <div className="flex items-center gap-3">
                                    {/* Thumbnail giả lập */}
                                    <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-xs font-black text-slate-500 border border-slate-300">
                                        {course.thumbnail}
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-700 block text-sm sm:text-base group-hover:text-green-700 transition-colors">
                                            {course.title}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-400">ID: #{course.id}</span>
                                    </div>
                                </div>
                            </td>

                            {/* Cột 2: Giảng viên */}
                            <td className="p-5">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-[10px] font-bold border border-green-200">
                                        {course.instructor.charAt(0)}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-600">{course.instructor}</span>
                                </div>
                            </td>

                            {/* Cột 3: Danh mục */}
                            <td className="p-5">
                                <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                                    {course.category}
                                </span>
                            </td>

                            {/* Cột 4: Ngày */}
                            <td className="p-5 text-sm font-medium text-slate-500">{course.submittedDate}</td>

                            {/* Cột 5: Trạng thái */}
                            <td className="p-5">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold border border-orange-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                    Chờ duyệt
                                </span>
                            </td>

                            {/* Cột 6: HÀNH ĐỘNG (ĐÃ NÂNG CẤP) */}
                            <td className="p-5">
                                <div className="flex items-center justify-center gap-2">
                                    
                                    {/* Nút Xem */}
                                    <button 
                                        onClick={() => handleView(course.title)}
                                        title="Xem chi tiết"
                                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                    >
                                        <Eye size={18} strokeWidth={2.5} />
                                    </button>

                                    

                                    {/* Nút Từ chối (Đỏ) */}
                                    <button 
                                        onClick={() => handleReject(course.title)}
                                        title="Từ chối"
                                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                    >
                                        <XCircle size={18} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}