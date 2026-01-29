import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
} from "lucide-react";
import { getModulesByCourse } from "../../services/moduleService";
import { getLessonsByModule } from "../../services/lessonService";
import CreateLessonByUpload from "./CreateLesson";

export default function ModuleManager() {
  const { state } = useLocation();

  const courseId = state?.courseId;
  const courseName = state?.courseName;

  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-emerald-100 text-sm font-medium">
                Quản lý Module & Lesson
              </p>
              <h1 className="text-2xl font-bold">{courseName}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDEBAR - MODULE LIST */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-3 border-b border-slate-200">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <Layers size={18} className="text-emerald-600" />
                  Danh sách Modules
                </h2>
              </div>

              <div className="p-4">
                {loadingModules ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-3"></div>
                    <p className="text-sm text-slate-600">
                      Đang tải modules...
                    </p>
                  </div>
                ) : modules.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Layers size={24} className="text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500">Chưa có module nào</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {modules.map((m) => {
                      const moduleId = m.moduleId || m.id;
                      const isSelected =
                        selectedModule?.moduleId === moduleId ||
                        selectedModule?.id === moduleId;

                      return (
                        <li
                          key={moduleId}
                          onClick={() => {
                            setSelectedModule(m);
                            fetchLessons(moduleId);
                            setShowCreateForm(false);
                          }}
                          className={`group rounded-xl px-4 py-3 cursor-pointer transition-all ${
                            isSelected
                              ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md"
                              : "border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                                  isSelected
                                    ? "bg-white/20 text-white"
                                    : "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200"
                                }`}
                              >
                                {m.orderIndex}
                              </div>
                              <span
                                className={`font-medium text-sm ${isSelected ? "text-white" : "text-slate-800"}`}
                              >
                                {m.title}
                              </span>
                            </div>
                            <ChevronRight
                              size={18}
                              className={`${
                                isSelected
                                  ? "text-white"
                                  : "text-slate-400 group-hover:text-emerald-600"
                              }`}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT - LESSONS */}
          <div className="lg:col-span-2">
            {selectedModule ? (
              <div className="space-y-6">
                {/* SELECTED MODULE HEADER */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">
                        Module đang chọn
                      </p>
                      <h3 className="text-xl font-bold text-slate-800">
                        {selectedModule.title}
                      </h3>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                      <span className="text-emerald-600 font-bold">
                        {selectedModule.orderIndex}
                      </span>
                    </div>
                  </div>

                  {/* TOGGLE CREATE LESSON BUTTON */}
                  <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className={`w-full px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      showCreateForm
                        ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {showCreateForm ? (
                      <>
                        <ChevronDown
                          size={20}
                          className={showCreateForm ? "rotate-180" : ""}
                        />
                        Đóng form
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        Thêm Lesson mới
                      </>
                    )}
                  </button>

                  {/* CREATE LESSON FORM */}
                  {showCreateForm && (
                    <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Plus size={18} className="text-white" />
                        </div>
                        <h4 className="font-bold text-blue-900">
                          Tạo Lesson mới
                        </h4>
                      </div>
                      <CreateLessonByUpload
                        moduleId={selectedModule.moduleId || selectedModule.id}
                        onCreated={() => {
                          fetchLessons(
                            selectedModule.moduleId || selectedModule.id,
                          );
                          setShowCreateForm(false);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* LESSONS LIST */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      <Video size={18} className="text-emerald-600" />
                      Danh sách Lessons
                      {lessons.length > 0 && (
                        <span className="text-sm font-normal text-slate-500">
                          ({lessons.length})
                        </span>
                      )}
                    </h4>
                  </div>

                  <div className="p-6">
                    {loadingLessons ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-3"></div>
                        <p className="text-sm text-slate-600">
                          Đang tải lessons...
                        </p>
                      </div>
                    ) : lessons.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Video size={32} className="text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500 font-medium">
                          Chưa có lesson nào
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Thêm lesson đầu tiên cho module này
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {lessons.map((l, idx) => (
                          <div
                            key={l.lessonId}
                            className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
                          >
                            {/* LESSON HEADER */}
                            <div className="bg-gradient-to-r from-slate-50 to-white px-4 py-3 border-b border-slate-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <Play
                                      size={16}
                                      className="text-emerald-600"
                                      fill="currentColor"
                                    />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-slate-800">
                                      {idx + 1}. {l.title}
                                    </h5>
                                  </div>
                                </div>
                                {l.duration && (
                                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                                    <Clock size={14} />
                                    <span>{l.duration}s</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* LESSON CONTENT */}
                            <div className="p-4 space-y-3">
                              {/* VIDEO */}
                              {l.videoUrl && (
                                <div className="rounded-lg overflow-hidden bg-black">
                                  <video
                                    src={l.videoUrl}
                                    controls
                                    className="w-full"
                                  />
                                </div>
                              )}

                              {/* DOCUMENT */}
                              {l.documentUrl && (
                                <a
                                  href={l.documentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-blue-700 font-medium text-sm"
                                >
                                  <Download size={16} />
                                  <span>Tải tài liệu</span>
                                </a>
                              )}

                              {/* TRANSCRIPT */}
                              {l.transcript && (
                                <details className="group">
                                  <summary className="cursor-pointer px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                                      <FileText size={16} />
                                      <span>Xem Transcript</span>
                                    </div>
                                    <ChevronDown
                                      size={16}
                                      className="text-slate-400 group-open:rotate-180 transition-transform"
                                    />
                                  </summary>
                                  <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="max-h-60 overflow-y-auto text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                      {l.transcript}
                                    </div>
                                  </div>
                                </details>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Layers size={40} className="text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    Chọn một Module
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Chọn module từ danh sách bên trái để xem và quản lý lessons
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
