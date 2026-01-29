import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Video,
  FileText,
  Clock,
  ChevronRight,
  Play,
  Download,
  Layers,
  Plus,
  ChevronDown,
  ChevronLeft,
  MoreVertical,
  Settings,
  Users,
  X,
} from "lucide-react";
import { getModulesByCourse } from "../../services/moduleService";
import { getLessonsByModule } from "../../services/lessonService";
import CreateLessonByUpload from "./CreateLesson";

// --- COMPONENT: MODULE CARD (Similar to LessonCard from CoursePlayer) ---
const ModuleCard = ({ module, isActive, onClick }) => {
  return (
    <div
      onClick={() => onClick(module)}
      className={`relative group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border cursor-pointer select-none
        ${
          isActive
            ? "bg-emerald-50/80 border-emerald-200 shadow-sm ring-1 ring-emerald-100"
            : "bg-white border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 hover:shadow-sm"
        }
      `}
    >
      {/* Icon trạng thái */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors font-bold text-base
        ${
          isActive
            ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md"
            : "bg-slate-100 text-slate-600 group-hover:text-emerald-600 group-hover:bg-emerald-100"
        }
      `}
      >
        {module.orderIndex}
        {isActive && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 rounded-l-xl"></div>
        )}
      </div>

      {/* Thông tin module */}
      <div className="flex-1 min-w-0 py-0.5">
        <h4
          className={`font-medium text-sm leading-tight truncate mb-1 ${isActive ? "text-emerald-900 font-bold" : "text-slate-700"}`}
        >
          {module.title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
            <Layers size={10} /> Module {module.orderIndex}
          </span>
          {isActive && (
            <span className="text-emerald-600 font-bold">• Đang chỉnh sửa</span>
          )}
        </div>
      </div>

      {/* Chevron */}
      <ChevronRight
        size={18}
        className={`transition-colors ${isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-600"}`}
      />
    </div>
  );
};

// --- COMPONENT: COMPACT LESSON CARD ---
const CompactLessonCard = ({ lesson, index, isActive, onClick }) => {
  return (
    <div
      onClick={() => onClick(lesson)}
      className={`relative group flex items-center gap-2.5 p-2.5 rounded-lg transition-all duration-200 border cursor-pointer select-none ml-6
        ${
          isActive
            ? "bg-blue-50/80 border-blue-200 shadow-sm ring-1 ring-blue-100"
            : "bg-white border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 hover:shadow-sm"
        }
      `}
    >
      {/* Icon */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
        ${
          isActive
            ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm"
            : "bg-slate-100 text-slate-600 group-hover:text-blue-600 group-hover:bg-blue-100"
        }
      `}
      >
        <Play size={12} fill={isActive ? "currentColor" : "none"} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h5
          className={`font-medium text-xs leading-tight truncate ${isActive ? "text-blue-900 font-bold" : "text-slate-700"}`}
        >
          {index + 1}. {lesson.title}
        </h5>
        {lesson.duration && (
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
            <Clock size={9} />
            <span>{lesson.duration}s</span>
          </div>
        )}
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
      )}
    </div>
  );
};

export default function ModuleManager() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const courseId = state?.courseId;
  const courseName = state?.courseName;

  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  /* ================= FETCH MODULES ================= */
  const fetchModules = async () => {
    if (!courseId) return;

    try {
      setLoadingModules(true);
      const res = await getModulesByCourse(courseId);
      setModules(res.data.data || []);
    } catch (err) {
      console.error("Fetch modules failed", err);
    } finally {
      setLoadingModules(false);
    }
  };

  /* ================= FETCH LESSONS ================= */
  const fetchLessons = async (moduleId) => {
    if (!moduleId) return;

    try {
      setLoadingLessons(true);
      const res = await getLessonsByModule(moduleId);
      setLessons(res.data.data || []);
    } catch (err) {
      console.error("Fetch lessons failed", err);
    } finally {
      setLoadingLessons(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden">
      {/* ================= HEADER: INSTRUCTOR STYLE ================= */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center px-4 md:px-6 justify-between shrink-0 z-40 fixed top-0 left-0 right-0">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-4 flex-1 truncate">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 text-slate-500 transition-all"
          >
            <ChevronLeft
              size={22}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </button>
          <div className="hidden md:block w-[1px] h-8 bg-slate-200/80 mx-2"></div>
          <div className="flex flex-col truncate">
            <h2 className="font-bold text-slate-800 text-sm md:text-base truncate">
              {courseName}
            </h2>
            <span className="text-xs text-slate-500 font-medium hidden md:inline-block">
              Quản lý Module & Lesson
            </span>
          </div>
        </div>

        {/* Right: Instructor Info */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Stats Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-blue-50/50 text-blue-600 rounded-full text-sm font-bold border border-blue-100/50">
            <Users size={16} />
            <span>Instructor</span>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200/80">
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-indigo-100 border-[3px] border-white shadow-sm overflow-hidden ring-2 ring-indigo-500/20 group-hover:ring-indigo-500 transition-all">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Instructor"
                  alt="Instructor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT (SPLIT VIEW) ================= */}
      <div className="flex-1 flex overflow-hidden pt-16">
        {/* ----- LEFT: MAIN WORKSPACE ----- */}
        <div className="flex-1 flex flex-col overflow-y-auto scroll-smooth bg-slate-50/30 relative">
          {/* Subtle background pattern */}
          <div
            className="absolute inset-0 opacity-[0.15] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          ></div>

          <div className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-6 lg:p-8 z-10">
            {selectedLesson ? (
              <div className="space-y-6">
                {/* LESSON DETAIL CARD */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  {/* LESSON HEADER */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                          <Play
                            size={20}
                            className="text-white"
                            fill="currentColor"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">
                            Lesson{" "}
                            {lessons.findIndex(
                              (l) => l.lessonId === selectedLesson.lessonId,
                            ) + 1}
                          </p>
                          <h3 className="text-xl font-bold text-slate-800">
                            {selectedLesson.title}
                          </h3>
                        </div>
                      </div>
                      {selectedLesson.duration && (
                        <div className="flex items-center gap-2 text-slate-600 bg-white px-3 py-2 rounded-lg shadow-sm">
                          <Clock size={16} />
                          <span className="font-semibold">
                            {selectedLesson.duration}s
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* LESSON CONTENT */}
                  <div className="p-6 space-y-6">
                    {/* VIDEO */}
                    {selectedLesson.videoUrl && (
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                          <Video size={16} className="text-blue-600" />
                          Video bài học
                        </h4>
                        <div className="rounded-xl overflow-hidden bg-black shadow-lg">
                          <video
                            src={selectedLesson.videoUrl}
                            controls
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}

                    {/* DOCUMENT */}
                    {selectedLesson.documentUrl && (
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                          <FileText size={16} className="text-blue-600" />
                          Tài liệu đính kèm
                        </h4>
                        <a
                          href={selectedLesson.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 px-5 py-3.5 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors text-blue-700 font-semibold"
                        >
                          <Download size={18} />
                          <span>Tải tài liệu xuống</span>
                        </a>
                      </div>
                    )}

                    {/* TRANSCRIPT */}
                    {selectedLesson.transcript && (
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                          <FileText size={16} className="text-blue-600" />
                          Transcript
                        </h4>
                        <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="max-h-96 overflow-y-auto text-sm text-slate-700 whitespace-pre-wrap leading-relaxed custom-scrollbar">
                            {selectedLesson.transcript}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : selectedModule ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Video size={48} className="text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    Chọn một Lesson
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Chọn lesson từ danh sách bên phải để xem chi tiết nội dung
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Layers size={48} className="text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    Chọn một Module
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Chọn module từ danh sách bên phải để xem và quản lý lessons
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ----- RIGHT: SIDEBAR (MODULE LIST) ----- */}
        <div className="w-[360px] lg:w-[400px] bg-white border-l border-slate-200 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] flex flex-col z-30 hidden lg:flex">
          {/* Sidebar Header */}
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Layers size={20} className="text-emerald-600" />
                Danh sách Modules
              </h3>
            </div>

            {/* Module count */}
            {modules.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="font-medium">Tổng cộng:</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md font-bold text-xs">
                  {modules.length} modules
                </span>
              </div>
            )}
          </div>

          {/* Module List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#FCFDFC] p-5">
            {loadingModules ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-3"></div>
                <p className="text-sm text-slate-600">Đang tải modules...</p>
              </div>
            ) : modules.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Layers size={24} className="text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">Chưa có module nào</p>
              </div>
            ) : (
              <div className="space-y-2">
                {modules.map((m) => {
                  const moduleId = m.moduleId || m.id;
                  const isSelected =
                    selectedModule?.moduleId === moduleId ||
                    selectedModule?.id === moduleId;

                  return (
                    <div key={moduleId}>
                      <ModuleCard
                        module={m}
                        isActive={isSelected}
                        onClick={(module) => {
                          setSelectedModule(module);
                          fetchLessons(moduleId);
                          setShowCreateForm(false);
                        }}
                      />
                      {/* Add Lesson Button - shows below selected module */}
                      {isSelected && (
                        <>
                          <button
                            onClick={() => setShowCreateForm(true)}
                            className="w-full mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-emerald-200/50 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                          >
                            <Plus size={18} />
                            Thêm Lesson vào module này
                          </button>

                          {/* Compact Lesson List */}
                          {loadingLessons ? (
                            <div className="mt-2 p-4 text-center">
                              <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                            </div>
                          ) : (
                            lessons.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {lessons.map((lesson, idx) => (
                                  <CompactLessonCard
                                    key={lesson.lessonId}
                                    lesson={lesson}
                                    index={idx}
                                    isActive={
                                      selectedLesson?.lessonId ===
                                      lesson.lessonId
                                    }
                                    onClick={setSelectedLesson}
                                  />
                                ))}
                              </div>
                            )
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CREATE LESSON POPUP MODAL */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 flex items-center justify-between border-b border-emerald-400/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Plus size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    Tạo Lesson Mới
                  </h3>
                  <p className="text-emerald-50 text-sm">
                    Module: {selectedModule?.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <CreateLessonByUpload
                moduleId={selectedModule?.moduleId || selectedModule?.id}
                onCreated={() => {
                  fetchLessons(selectedModule?.moduleId || selectedModule?.id);
                  setShowCreateForm(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #CBD5E1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94A3B8;
        }
      `}</style>
    </div>
  );
}
