import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  Sparkles,
  AlertCircle,
  Pencil,
  Trash2,
  Layout,
  Edit3,
  ArrowUpWideNarrow,
  Check,
  Upload,
  FilePlus,
} from "lucide-react";
import { getModulesByCourse, deleteModule, updateModule } from "../../services/moduleService";
import {
  getLessonsByModule,
  generateQuizForLesson,
  deleteLesson,
  updateLesson,
} from "../../services/lessonService";
import CreateLessonByUpload from "./CreateLesson";
import QuizDisplay from "./QuizDisplay";
import Modal from "../../components/common/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

// --- COMPONENT: MODULE CARD ---
const ModuleCard = ({ module, isActive, onClick, onEdit, onDelete, isLocked }) => {
  return (
    <div
      onClick={() => onClick(module)}
      className={`relative group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border cursor-pointer select-none
        ${
          isActive
            ? "bg-emerald-50/80 border-emerald-200 shadow-sm ring-1 ring-emerald-100"
            : "bg-white border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 hover:shadow-sm"
        }
        ${module.isPendingDeletion ? "opacity-60 grayscale blur-[0.5px]" : ""}
      `}
    >
      {/* Icon trạng thái */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors font-bold text-base
        ${
          module.isPendingDeletion
            ? "bg-rose-100 text-rose-700"
            : isActive
              ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md"
              : "bg-slate-100 text-slate-600 group-hover:text-emerald-600 group-hover:bg-emerald-100"
        }
      `}
      >
        {module.orderIndex}
        {isActive && !module.isPendingDeletion && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 rounded-l-xl"></div>
        )}
      </div>

      {/* Thông tin module */}
      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex items-center gap-1.5 mb-1">
          <h4
            className={`font-medium text-sm leading-tight truncate ${
              module.isPendingDeletion 
                ? "text-rose-800 line-through" 
                : isActive ? "text-emerald-900 font-bold" : "text-slate-700"
            }`}
          >
            {module.title}
          </h4>
          {module.isPending && (
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[8px] font-bold rounded uppercase shrink-0">Mới</span>
          )}
          {module.isPendingDeletion && (
            <span className="px-1.5 py-0.5 bg-rose-100 text-rose-700 text-[8px] font-bold rounded uppercase shrink-0">Chờ xóa</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
            <Layers size={9} /> Module {module.orderIndex}
          </span>
          {isActive && !module.isPendingDeletion && (
            <span className="text-emerald-600 font-extrabold text-[10px]">• Đang chọn</span>
          )}
        </div>
      </div>

      {/* Chevron & Actions */}
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        {!isLocked && !module.isPendingDeletion && (
          <>
            <button 
              onClick={() => onEdit(module)} 
              title="Chỉnh sửa Module"
              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              <Pencil size={16} />
            </button>
            <button 
              onClick={() => onDelete(module)} 
              title="Xóa Module"
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
        <ChevronRight
          size={18}
          className={`transition-colors ${isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-600"}`}
        />
      </div>
    </div>
  );
};

// --- COMPONENT: COMPACT LESSON CARD ---
const CompactLessonCard = ({ lesson, index, isActive, onClick, onEdit, onDelete, isLocked }) => {
  return (
    <div
      onClick={() => onClick(lesson)}
      className={`relative group flex items-center gap-2.5 p-2.5 rounded-lg transition-all duration-200 border cursor-pointer select-none ml-6
        ${
          isActive
            ? "bg-blue-50/80 border-blue-200 shadow-sm ring-1 ring-blue-100"
            : "bg-white border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 hover:shadow-sm"
        }
        ${lesson.isPendingDeletion ? "opacity-60 grayscale" : ""}
      `}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
        ${
          lesson.isPendingDeletion
           ? "bg-rose-100 text-rose-600"
           : isActive
             ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm"
             : "bg-slate-100 text-slate-600 group-hover:text-blue-600 group-hover:bg-blue-100"
        }
      `}
      >
        <Play size={12} fill={isActive && !lesson.isPendingDeletion ? "currentColor" : "none"} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h5
            className={`font-medium text-[11px] leading-tight truncate ${
              lesson.isPendingDeletion 
                ? "text-rose-800 line-through" 
                : isActive ? "text-blue-900 font-bold" : "text-slate-700"
            }`}
          >
            {index + 1}. {lesson.title}
          </h5>
          {lesson.isPending && (
            <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-[7px] font-bold rounded uppercase">Mới</span>
          )}
          {lesson.isPendingDeletion && (
            <span className="px-1 py-0.5 bg-rose-100 text-rose-700 text-[7px] font-bold rounded uppercase">Chờ xóa</span>
          )}
        </div>
        {lesson.duration && (
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
            <Clock size={9} />
            <span>{lesson.duration}s</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        {isActive && !lesson.isPendingDeletion && (
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-1 animate-pulse"></div>
        )}
        {!isLocked && !lesson.isPendingDeletion && (
          <>
            <button 
              onClick={() => onEdit(lesson)} 
              title="Chỉnh sửa Lesson"
              className="p-1 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-all font-bold"
            >
              <Pencil size={14} />
            </button>
            <button 
              onClick={() => onDelete(lesson)} 
              title="Xóa Lesson"
              className="p-1 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default function ModuleManager() {
  const location = useLocation();
  const { state } = location || {};
  const navigate = useNavigate();
  const { moduleId: urlModuleId } = useParams();

  const courseId = state?.courseId;
  const courseName = state?.courseName || "Chi tiết khóa học";
  const courseStatus = state?.courseStatus;

  // Khóa chỉnh sửa nếu không phải là DRAFT, EDITING hoặc REJECTED
  const isLocked = useMemo(() => {
    // Chỉ cho phép sửa nếu là bản nháp, đã mở khóa để sửa, hoặc bị từ chối (cần sửa lại)
    return !["DRAFT", "EDITING", "REJECTED"].includes(courseStatus);
  }, [courseStatus]);

  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(state?.moduleData || null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [loadingModules, setLoadingModules] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [quizError, setQuizError] = useState("");

  const fetchModules = async () => {
    if (!courseId) {
      setLoadingModules(false);
      return;
    }
    try {
      setLoadingModules(true);
      const res = await getModulesByCourse(courseId);
      const fetchedModules = res.data.data || [];
      setModules(fetchedModules);
      
      // Auto-select module from URL if it's there
      if (urlModuleId && !selectedModule) {
        const target = fetchedModules.find(m => (m.moduleId || m.id) === urlModuleId);
        if (target) {
          setSelectedModule(target);
          fetchLessons(urlModuleId);
        }
      }
    } catch (err) {
      console.error("Fetch modules failed", err);
    } finally {
      setLoadingModules(false);
    }
  };

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

  const handleGenerateQuiz = async () => {
    if (!selectedLesson?.lessonId) {
      setQuizError("Vui lòng chọn lesson trước");
      return;
    }
    try {
      setGeneratingQuiz(true);
      setQuizError("");
      await generateQuizForLesson(selectedLesson.lessonId);
      alert("✅ Quiz đang được tạo tự động bằng AI. Vui lòng đợi vài phút!");
      await fetchLessons(selectedModule?.moduleId || selectedModule?.id);
    } catch (err) {
      setQuizError(err.response?.data?.message || "Tạo quiz thất bại");
    } finally {
      setGeneratingQuiz(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [courseId]);

  const handleEditModule = (module) => {
    setEditingModule({
      id: module.moduleId || module.id,
      title: module.title,
      orderIndex: module.orderIndex
    });
  };

  const handleUpdateModule = async () => {
    if (!editingModule || !editingModule.title.trim()) return;
    try {
      setActionLoading(true);
      await updateModule(editingModule.id, editingModule.title.trim(), editingModule.orderIndex);
      await fetchModules();
      setEditingModule(null);
    } catch (err) {
      alert("Có lỗi xảy ra khi cập nhật Module!");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson({
      id: lesson.lessonId,
      title: lesson.title,
      orderIndex: lesson.orderIndex || 0,
      videoFile: null,
      documentFile: null,
      existingVideo: lesson.videoUrl,
      existingDocument: lesson.documentUrl
    });
  };

  const handleUpdateLesson = async () => {
    if (!editingLesson || !editingLesson.title.trim()) return;
    try {
      setActionLoading(true);
      await updateLesson(
        editingLesson.id, 
        editingLesson.title.trim(), 
        editingLesson.orderIndex,
        editingLesson.videoFile,
        editingLesson.documentFile
      );
      if (selectedModule) {
        await fetchLessons(selectedModule.moduleId || selectedModule.id);
      }
      setEditingLesson(null);
    } catch (err) {
      alert("Có lỗi xảy ra khi cập nhật Lesson!");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    try {
      setActionLoading(true);
      if (deletingItem.type === 'module') {
        const id = deletingItem.item.moduleId || deletingItem.item.id;
        await deleteModule(id);
        if ((selectedModule?.moduleId || selectedModule?.id) === id) {
          setSelectedModule(null);
          setLessons([]);
          setSelectedLesson(null);
        }
        await fetchModules();
      } else {
        await deleteLesson(deletingItem.item.lessonId);
        if (selectedLesson?.lessonId === deletingItem.item.lessonId) {
          setSelectedLesson(null);
        }
        await fetchLessons(selectedModule?.moduleId || selectedModule?.id);
      }
      setDeletingItem(null);
    } catch (err) {
      alert("Có lỗi xảy ra khi xóa!");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] font-sans text-slate-800 overflow-hidden">
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center px-4 md:px-6 justify-between shrink-0 z-40 fixed top-0 left-0 right-0">
        <div className="flex items-center gap-4 flex-1 truncate">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 text-slate-500 transition-all"
          >
            <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="hidden md:block w-[1px] h-8 bg-slate-200/80 mx-2"></div>
          <div className="flex flex-col truncate">
            <h2 className="font-bold text-slate-800 text-sm md:text-base truncate">{courseName}</h2>
            <span className="text-xs text-slate-500 font-medium hidden md:inline-block">Quản lý Module & Lesson</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-blue-50/50 text-blue-600 rounded-full text-sm font-bold border border-blue-100/50">
            <Users size={16} />
            <span>Instructor</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden pt-16">
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50/30 relative">
          <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
          
          <div className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-6 lg:p-8 z-10">
            {isLocked && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <AlertCircle className="text-amber-600" size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-amber-900 leading-tight mb-1 flex items-center gap-2">
                    Nội dung đang được khóa (Satus: <span className="bg-amber-200 px-2 py-0.5 rounded text-xs uppercase">{courseStatus}</span>)
                  </h4>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Bạn không thể thêm, sửa hoặc xóa nội dung khi khóa học ở trạng thái này. 
                    {courseStatus === 'APPROVED' ? ' Để cập nhật nội dung, hãy quay lại và chọn "Gửi yêu cầu cập nhật" tại trang quản lý khóa học.' : ' Vui lòng đợi kết quả duyệt từ Staff.'}
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/instructor/courses')}
                  className="bg-white px-4 py-2 rounded-lg text-sm font-bold text-amber-700 border border-amber-200 hover:bg-amber-50 transition-colors shadow-sm"
                >
                  Quay lại
                </button>
              </div>
            )}
            {selectedLesson ? (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                          <Play size={20} className="text-white" fill="currentColor" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-medium mb-1">Lesson {lessons.findIndex(l => l.lessonId === selectedLesson.lessonId) + 1}</p>
                          <h3 className="text-xl font-bold text-slate-800">{selectedLesson.title}</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {selectedLesson.duration && (
                          <div className="flex items-center gap-2 text-slate-600 bg-white px-3 py-2 rounded-lg shadow-sm">
                            <Clock size={16} />
                            <span className="font-semibold">{selectedLesson.duration}s</span>
                          </div>
                        )}
                        <button onClick={handleGenerateQuiz} disabled={generatingQuiz} className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-md transition-all disabled:opacity-50">
                          {generatingQuiz ? "Đang tạo..." : <><Sparkles size={16} /> Tạo Quiz AI</>}
                        </button>
                      </div>
                    </div>
                  </div>
                  {quizError && <div className="mx-6 mt-4 p-4 bg-red-50 rounded-xl border border-red-200 text-red-700 text-sm">{quizError}</div>}
                  <div className="p-6 space-y-6">
                    {selectedLesson.videoUrl && (
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Video size={16} /> Video bài học</h4>
                        <div className="rounded-xl overflow-hidden bg-black shadow-lg">
                          <video src={selectedLesson.videoUrl} controls className="w-full" />
                        </div>
                      </div>
                    )}
                    {selectedLesson.documentUrl && (
                      <div>
                        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><FileText size={16} /> Tài liệu đính kèm</h4>
                        <a href={selectedLesson.documentUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-semibold">
                          <Download size={18} /> <span>Tải tài liệu</span>
                        </a>
                      </div>
                    )}
                    <QuizDisplay lessonId={selectedLesson.lessonId} quizStatus={selectedLesson.quizStatus} />
                  </div>
                </div>
              </div>
            ) : selectedModule ? (
              <div className="flex items-center justify-center h-full text-center">
                <div><Video size={48} className="text-blue-600 mx-auto mb-4" /><h3 className="text-2xl font-bold mb-2">Chọn một Lesson</h3><p className="text-slate-500">Chọn lesson từ danh sách bên phải</p></div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center">
                <div><Layers size={48} className="text-emerald-600 mx-auto mb-4" /><h3 className="text-2xl font-bold mb-2">Chọn một Module</h3><p className="text-slate-500">Chọn module từ danh sách bên phải</p></div>
              </div>
            )}
          </div>
        </div>

        <div className="w-[360px] lg:w-[400px] bg-white border-l border-slate-200 flex flex-col hidden lg:flex">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Layers size={20} className="text-emerald-600" /> Danh sách Modules</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-2">
            {loadingModules ? (
              <div className="text-center py-8"><div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div></div>
            ) : modules.length === 0 ? (
              <div className="text-center py-8 text-slate-500">Chưa có module nào</div>
            ) : (
              modules.map((m) => {
                const moduleId = m.moduleId || m.id;
                const isSelected = (selectedModule?.moduleId || selectedModule?.id) === moduleId;
                return (
                  <div key={moduleId}>
                    <ModuleCard
                      module={m}
                      isActive={isSelected}
                      onClick={(mod) => { setSelectedModule(mod); fetchLessons(moduleId); setQuizError(""); }}
                      onEdit={() => handleEditModule(m)}
                      onDelete={() => setDeletingItem({ type: 'module', item: m })}
                      isLocked={isLocked}
                    />
                    {isSelected && (
                      <div className="mt-2 space-y-2">
                        {!isLocked && (
                          <button onClick={() => setShowCreateForm(true)} className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-emerald-700 transition-colors">
                            <Plus size={18} /> Thêm Lesson
                          </button>
                        )}
                        {loadingLessons ? (
                          <div className="p-4 text-center"><div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
                        ) : (
                          lessons.map((lesson, idx) => (
                            <CompactLessonCard
                              key={lesson.lessonId}
                              lesson={lesson}
                              index={idx}
                              isActive={selectedLesson?.lessonId === lesson.lessonId}
                              onClick={(l) => setSelectedLesson(l)}
                              onEdit={() => handleEditLesson(lesson)}
                              onDelete={() => setDeletingItem({ type: 'lesson', item: lesson })}
                              isLocked={isLocked}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <Play size={24} fill="white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Thêm Bài Học Mới</h3>
                  <p className="text-emerald-100 text-xs font-medium">Module: {selectedModule?.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="hover:rotate-90 transition-transform duration-300 p-2 hover:bg-white/10 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <CreateLessonByUpload
                moduleId={selectedModule?.moduleId || selectedModule?.id}
                onCreated={() => { fetchLessons(selectedModule?.moduleId || selectedModule?.id); setShowCreateForm(false); }}
              />
            </div>
          </div>
        </div>
      )}

      {editingModule && (
        <Modal 
          isOpen={!!editingModule} 
          onClose={() => setEditingModule(null)} 
          title="Thông tin Module"
          className="rounded-[2.5rem] overflow-hidden"
          footer={
            <div className="flex gap-3 justify-end w-full">
              <Button variant="ghost" onClick={() => setEditingModule(null)} className="rounded-xl px-6">Hủy</Button>
              <Button 
                variant="primary" 
                isLoading={actionLoading} 
                onClick={handleUpdateModule}
                className="rounded-xl px-8 bg-gradient-to-r from-blue-600 to-indigo-600 border-none hover:shadow-lg hover:shadow-blue-500/30 transition-all font-bold"
              >
                Lưu thay đổi
              </Button>
            </div>
          }
        >
          <div className="space-y-6 pt-2">
            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 mb-2">
              <div className="flex items-center gap-3 text-blue-700 mb-1">
                <Layout size={20} className="font-bold" />
                <span className="font-bold text-sm tracking-wide uppercase">Cấu trúc Module</span>
              </div>
              <p className="text-xs text-blue-600/80">Thay đổi tiêu đề hoặc điều chỉnh vị trí hiển thị của module trong khóa học.</p>
            </div>
            <div className="space-y-5">
              <Input 
                label="Tiêu đề Module" 
                icon={<Edit3 size={18} className="text-slate-400" />}
                placeholder="Vd: Nhập môn lập trình Java..."
                value={editingModule.title} 
                onChange={(e) => setEditingModule({...editingModule, title: e.target.value})} 
                className="rounded-xl focus:ring-blue-500/20"
              />
              <Input 
                label="Thứ tự hiển thị" 
                type="number" 
                icon={<ArrowUpWideNarrow size={18} className="text-slate-400" />}
                value={editingModule.orderIndex} 
                onChange={(e) => setEditingModule({...editingModule, orderIndex: parseInt(e.target.value)})}
                className="rounded-xl"
                helper="Số càng nhỏ sẽ hiển thị lên đầu"
              />
            </div>
          </div>
        </Modal>
      )}

      {editingLesson && (
        <Modal 
          isOpen={!!editingLesson} 
          onClose={() => setEditingLesson(null)} 
          title="Chỉnh sửa bài học"
          headerClassName="bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
          footer={
            <div className="flex gap-3 justify-end w-full">
              <Button variant="ghost" onClick={() => setEditingLesson(null)} className="rounded-xl">Hủy bỏ</Button>
              <Button 
                variant="primary" 
                isLoading={actionLoading} 
                onClick={handleUpdateLesson}
                className="rounded-xl px-8 bg-gradient-to-r from-indigo-600 to-violet-600 border-none shadow-lg shadow-indigo-500/30 font-bold"
              >
                Cập nhật ngay
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 mb-2">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600 leading-none font-bold">
                    {editingLesson.orderIndex}
                </div>
                <div>
                    <h4 className="font-bold text-indigo-900 leading-none">Chỉnh sửa nội dung</h4>
                    <p className="text-[11px] text-indigo-600 mt-1 uppercase font-bold tracking-tighter">Bài học: {editingLesson.title}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Tên bài học" 
                value={editingLesson.title} 
                onChange={(e) => setEditingLesson({...editingLesson, title: e.target.value})} 
                className="rounded-xl"
              />
              <Input 
                label="Thứ tự hiển thị" 
                type="number" 
                value={editingLesson.orderIndex} 
                onChange={(e) => setEditingLesson({...editingLesson, orderIndex: parseInt(e.target.value)})} 
                className="rounded-xl"
              />
            </div>
            
            <div className="space-y-4 pt-2">
              <div className="relative group">
                <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Video size={16} className="text-indigo-500" /> Video bài học
                  <span className="text-[10px] font-normal text-slate-400 italic">(Để trống để giữ video cũ)</span>
                </label>
                <div className={`border-2 border-dashed ${editingLesson.videoFile ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-300'} rounded-2xl p-4 transition-all relative`}>
                  <input 
                    type="file" 
                    accept="video/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => setEditingLesson({...editingLesson, videoFile: e.target.files[0]})}
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${editingLesson.videoFile ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                        {editingLesson.videoFile ? <Check size={24} /> : <Upload size={24} />}
                    </div>
                    <p className="text-xs font-bold text-slate-600">
                      {editingLesson.videoFile ? editingLesson.videoFile.name : 'Chọn video mới (.mp4, .mov...)'}
                    </p>
                    {!editingLesson.videoFile && editingLesson.existingVideo && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] text-slate-500 font-medium border border-slate-200">
                        <Play size={10} fill="currentColor" /> Hiện có: {editingLesson.existingVideo.split('/').pop().substring(0, 20)}...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative group">
                <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <FileText size={16} className="text-emerald-500" /> Tài liệu đính kèm (PDF)
                  <span className="text-[10px] font-normal text-slate-400 italic">(Để trống để giữ file cũ)</span>
                </label>
                <div className={`border-2 border-dashed ${editingLesson.documentFile ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200 hover:border-emerald-300'} rounded-2xl p-4 transition-all relative`}>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => setEditingLesson({...editingLesson, documentFile: e.target.files[0]})}
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${editingLesson.documentFile ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                        {editingLesson.documentFile ? <Check size={24} /> : <FilePlus size={24} />}
                    </div>
                    <p className="text-xs font-bold text-slate-600">
                      {editingLesson.documentFile ? editingLesson.documentFile.name : 'Chọn tài liệu mới (.pdf, .doc...)'}
                    </p>
                    {!editingLesson.documentFile && editingLesson.existingDocument && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[10px] text-slate-500 font-medium border border-slate-200">
                        <FileText size={10} /> Hiện có: {editingLesson.existingDocument.split('/').pop().substring(0, 20)}...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {deletingItem && (
        <Modal 
          isOpen={!!deletingItem} 
          onClose={() => setDeletingItem(null)} 
          title="Xác nhận yêu cầu"
          headerClassName="bg-rose-50 text-rose-900"
          footer={
            <div className="flex gap-3 justify-end w-full">
              <Button variant="ghost" onClick={() => setDeletingItem(null)} className="rounded-xl">Hủy</Button>
              <Button 
                variant="danger" 
                isLoading={actionLoading} 
                onClick={confirmDelete}
                className="rounded-xl px-10 bg-rose-600 hover:bg-rose-700 transition-all font-bold shadow-lg shadow-rose-200"
              >
                Xác nhận
              </Button>
            </div>
          }
        >
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-20 h-20 bg-rose-100 rounded-3xl flex items-center justify-center text-rose-600 mb-6 animate-bounce-subtle">
              <Trash2 size={40} />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">Bạn có chắc chắn?</h4>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-4 w-full">
                <p className="text-slate-600 text-sm leading-relaxed">
                  Bạn đang yêu cầu xóa {deletingItem.type === 'module' ? 'Module' : 'Lesson'} <span className="font-bold text-slate-800">"{deletingItem.item.title}"</span>.
                </p>
            </div>
            <div className="flex items-start gap-2 text-left text-[11px] text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <p>Lưu ý: Nếu khóa học đã được duyệt, yêu cầu xóa này sẽ được gửi đến Staff để kiểm duyệt trước khi chính thức bị xóa khỏi hệ thống.</p>
            </div>
          </div>
        </Modal>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        
        @keyframes bounce-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
            animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
