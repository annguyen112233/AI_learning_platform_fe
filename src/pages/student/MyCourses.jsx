import React from 'react';
import { Search, Filter, CheckCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export default function MyCourses() {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: "Luyện thi JLPT N5 - Mọi thứ cho người mới bắt đầu",
      progress: 45,
      totalLessons: 20,
      completedLessons: 9,
      image: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&q=80&w=600",
      lastAccessed: "2 giờ trước"
    },
    {
      id: 2,
      title: "Kanji cơ bản: 100 chữ Hán tự thông dụng nhất",
      progress: 10,
      totalLessons: 15,
      completedLessons: 1,
      image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80&w=600",
      lastAccessed: "1 ngày trước"
    },
    {
      id: 3,
      title: "Kaiwa: Giao tiếp văn phòng Nhật Bản",
      progress: 100,
      totalLessons: 12,
      completedLessons: 12,
      image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&q=80&w=600",
      lastAccessed: "1 tuần trước"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-emerald-700 flex items-center gap-2">
            📚 Khóa học của tôi
          </h1>
          <p className="text-slate-500 text-sm">
            Tiếp tục hành trình chinh phục tiếng Nhật nào!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-64">
            <Input icon={Search} placeholder="Tìm khóa học..." />
          </div>
          <Button variant="outline" className="h-[42px]">
            <Filter size={18} /> Lọc
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col"
          >
            <div className="h-48 overflow-hidden relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />

              {course.progress === 100 && (
                <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle size={12} /> Hoàn thành
                </div>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-base text-slate-800 mb-2 line-clamp-2">
                {course.title}
              </h3>

              <div className="mt-auto">
                <div className="flex justify-between text-sm text-slate-500 mb-2">
                  <span>{course.progress}% hoàn thành</span>
                  <span>{course.completedLessons}/{course.totalLessons} bài</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      course.progress === 100
                        ? 'bg-emerald-500'
                        : 'bg-emerald-600'
                    }`}
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>

                <Button
                  className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() =>
                    navigate(`/student/learning/${course.id}`)
                  }
                >
                  {course.progress === 0
                    ? "Bắt đầu học"
                    : course.progress === 100
                    ? "Ôn tập lại"
                    : "Tiếp tục học"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
