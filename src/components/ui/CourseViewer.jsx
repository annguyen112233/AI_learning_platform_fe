import React, { useState } from 'react';
import { PlayCircle, FileVideo, FileText, ChevronDown, ChevronUp } from 'lucide-react'; // Giả sử bạn dùng thư viện này

const CourseViewer = ({ selectedItem }) => {
    // 1. State để quản lý việc đóng mở các module (bạn đã có logic này rồi)
    const [expandedSections, setExpandedSections] = useState({});
    
    // !!! 2. State MỚI: Lưu bài học đang được chọn để xem
    const [activeLesson, setActiveLesson] = useState(null);

    const toggleSection = (moduleId) => {
        setExpandedSections(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    // !!! Hàm xử lý khi bấm vào bài học
    const handleLessonSelect = (lesson) => {
        setActiveLesson(lesson);
        // Tự động cuộn lên player nếu cần (tuỳ chọn)
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex-1 overflow-y-auto bg-slate-100 p-6 md:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                
                {/* !!! PHẦN PLAYER / HIỂN THỊ NỘI DUNG */}
                <div className="aspect-video bg-black rounded-xl shadow-lg flex items-center justify-center relative group overflow-hidden border border-slate-800">
                    
                    {/* Logic hiển thị: Nếu có bài học đang chọn -> Hiển thị Video/Content. Nếu không -> Hiển thị Thumbnail mặc định */}
                    {activeLesson ? (
                        activeLesson.videoUrl ? (
                            // Trường hợp 1: Bài học có Video
                            <iframe 
                                src={activeLesson.videoUrl} 
                                title={activeLesson.title}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                            /* Lưu ý: Nếu dùng file mp4 trực tiếp thay vì link youtube/vimeo thì dùng thẻ <video>:
                            <video src={activeLesson.videoUrl} controls autoPlay className="w-full h-full" />
                            */
                        ) : (
                            // Trường hợp 2: Bài học dạng văn bản/không có video
                            <div className="w-full h-full bg-white p-8 overflow-y-auto text-slate-700">
                                <h2 className="text-2xl font-bold mb-4">{activeLesson.title}</h2>
                                <div className="prose">
                                    <p>Nội dung bài học dạng văn bản sẽ hiển thị ở đây...</p>
                                    {/* {activeLesson.content} */}
                                </div>
                            </div>
                        )
                    ) : (
                        // Trường hợp 3: Chưa chọn bài nào -> Hiển thị Thumbnail mặc định (Code cũ của bạn)
                        <>
                            <img 
                                src={selectedItem.thumbnail || `https://source.unsplash.com/random/800x450/?coding,computer`} 
                                alt="Thumbnail" 
                                className="w-full h-full object-cover opacity-60" 
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <PlayCircle size={64} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                                <span className="absolute mt-24 text-white font-medium bg-black/50 px-3 py-1 rounded-full text-sm">
                                    Chọn bài học bên dưới để bắt đầu
                                </span>
                            </div>
                        </>
                    )}
                </div>

                {/* Course Structure */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Nội dung chi tiết</h3>
                    </div>
                    <div>
                        {selectedItem.modules && selectedItem.modules.length > 0 ? (
                            selectedItem.modules.map(module => (
                                <div key={module.moduleId} className="border-b border-slate-100 last:border-0">
                                    <div 
                                        onClick={() => toggleSection(module.moduleId)}
                                        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                    >
                                        <span className="text-sm font-bold text-slate-700">{module.title}</span>
                                        {expandedSections[module.moduleId] ? <ChevronUp size={16} className="text-slate-400"/> : <ChevronDown size={16} className="text-slate-400"/>}
                                    </div>
                                    
                                    {expandedSections[module.moduleId] && (
                                        <div className="bg-slate-50/50 border-t border-slate-100">
                                            {module.lessons && module.lessons.map(lesson => {
                                                // Kiểm tra xem bài này có đang được active không để đổi màu nền
                                                const isActive = activeLesson?.lessonId === lesson.lessonId;
                                                
                                                return (
                                                    <div 
                                                        key={lesson.lessonId} 
                                                        // !!! Gắn sự kiện click vào cả dòng
                                                        onClick={() => handleLessonSelect(lesson)}
                                                        className={`px-6 py-3 flex items-center justify-between cursor-pointer border-l-4 transition-all group
                                                            ${isActive 
                                                                ? 'bg-indigo-50 border-indigo-500' // Style khi đang chọn
                                                                : 'hover:bg-white border-transparent hover:border-indigo-300' // Style mặc định
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {/* Đổi màu icon khi active */}
                                                            {lesson.videoUrl 
                                                                ? <FileVideo size={16} className={isActive ? "text-indigo-600" : "text-slate-400"}/> 
                                                                : <FileText size={16} className={isActive ? "text-indigo-600" : "text-slate-400"}/>
                                                            }
                                                            <span className={`text-sm ${isActive ? "text-indigo-700 font-medium" : "text-slate-600"}`}>
                                                                {lesson.title}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs text-slate-400">--:--</span>
                                                            {/* Nút Xem: Thay đổi text thành "Đang xem" nếu active */}
                                                            <button className={`text-xs font-bold ${isActive ? "text-indigo-600 opacity-100" : "text-indigo-600 opacity-0 group-hover:opacity-100"}`}>
                                                                {isActive ? 'Đang xem' : 'Xem'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {(!module.lessons || module.lessons.length === 0) && (
                                                <div className="px-6 py-3 text-xs text-slate-400 italic">Chưa có bài học nào</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-slate-400 text-sm">Chưa có nội dung khóa học</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseViewer;