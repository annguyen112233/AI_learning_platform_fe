import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  BookOpen,
  DollarSign,
  User,
  ArrowRight,
  Layers,
  X,
  List,
  Send, // ✅ NEW
  AlertCircle, // ✅ NEW
} from "lucide-react";
import {
  getCoursesByInstructor,
  submitCourseForApproval,
} from "../../services/courseService"; // ✅ IMPORT
import { getModulesByCourse } from "../../services/moduleService";
import api from "../../services/api";
import CreateModule from "./CreateModule";

export default function CourseManager({ reloadKey }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [modulesMap, setModulesMap] = useState({});
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null); // ✅ NEW

  /* ================= FETCH COURSES ================= */
  const fetchCourses = async () => {
    try {
      setLoading(true);

      const meRes = await api.get("/accounts/me");
      const instructorId = meRes.data.data.id;

      const res = await getCoursesByInstructor(instructorId);
      const coursesData = res.data.data || [];

      setCourses(coursesData);

      // ✅ Pre-populate modulesMap from course data if available
      const newModulesMap = {};
      coursesData.forEach((course) => {
        if (course.modules && course.modules.length > 0) {
          newModulesMap[course.courseId] = course.modules;
        }
      });
      setModulesMap((prev) => ({ ...prev, ...newModulesMap }));
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FETCH MODULES ================= */
  const fetchModules = async (courseId) => {
    if (!courseId) {
      console.error("❌ courseId is undefined!");
      return;
    }

    try {
      const res = await getModulesByCourse(courseId);
      const modulesData = res.data.data || [];

      setModulesMap((prev) => ({
        ...prev,
        [courseId]: modulesData,
      }));
    } catch (error) {
      console.error("Failed to fetch modules for courseId:", courseId, error);
    }
  };

  /* ================= TOGGLE EXPAND (LIST MODULES) ================= */
  const handleToggleExpand = (courseId) => {
    if (expandedCourseId === courseId) {
      setExpandedCourseId(null);
    } else {
      setExpandedCourseId(courseId);
      if (!modulesMap[courseId]) {
        fetchModules(courseId);
      }
    }
  };

  /* ================= TOGGLE CREATE MODULE FORM ================= */
  const handleToggleCreateModule = (courseId) => {
    if (!courseId) {
      console.error("❌ Invalid courseId!");
      return;
    }

    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
    } else {
      setSelectedCourseId(courseId);
    }
  };

  /* ================= HANDLE MODULE CLICK ================= */
  const handleModuleClick = (module, course) => {
    const moduleId = module.moduleId || module.id || module.module_id;

    if (!moduleId) {
      console.error("❌ Module ID not found:", module);
      return;
    }

    navigate(`/instructor/module/${moduleId}`, {
      state: {
        courseId: course.courseId,
        courseName: course.title,
        moduleName: module.title,
        moduleData: module,
      },
    });
  };

  /* ================= HANDLE MODULE CREATED ================= */
  const handleModuleCreated = (courseId) => {
    fetchModules(courseId);
    setSelectedCourseId(null);
  };

  /* ================= ✅ SUBMIT COURSE FOR APPROVAL ================= */
  const handleSubmitForApproval = async (courseId) => {
    const modules = modulesMap[courseId] || [];

    // Check if course has at least 3 modules
    if (modules.length < 3) {
      alert("❌ Khóa học cần có ít nhất 3 modules để gửi duyệt!");
      return;
    }

    const confirmed = window.confirm(
      "⚠️ Bạn có chắc chắn muốn gửi khóa học này để được duyệt?\n\n" +
        "Sau khi gửi, bạn sẽ không thể chỉnh sửa cho đến khi được xét duyệt.",
    );

    if (!confirmed) return;

    try {
      setSubmitting(courseId);
      const response = await submitCourseForApproval(courseId);

      // ✅ Update course status in state
      const updatedCourse = response.data.data;

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.courseId === courseId ? updatedCourse : course,
        ),
      );

      // ✅ Update modules if included in response
      if (updatedCourse.modules) {
        setModulesMap((prev) => ({
          ...prev,
          [courseId]: updatedCourse.modules,
        }));
      }

      alert("✅ Gửi khóa học thành công! Vui lòng chờ staff xét duyệt.");
    } catch (error) {
      console.error("Failed to submit course for approval", error);
      const errorMsg =
        error.response?.data?.message ||
        "Không thể gửi khóa học. Vui lòng thử lại!";
      alert("❌ " + errorMsg);
    } finally {
      setSubmitting(null);
    }
  };

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchCourses();
  }, [reloadKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  /* ================= RENDER ================= */
  return (
    <div>
      {courses.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Chưa có khóa học nào
          </h3>
          <p className="text-slate-500 text-sm">
            Bắt đầu bằng cách tạo khóa học đầu tiên của bạn
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const isExpanded = expandedCourseId === course.courseId;
            const isCreateFormOpen = selectedCourseId === course.courseId;
            const modules = modulesMap[course.courseId] || [];

            // ✅ Status checks
            const isDraft =
              course.status === "DRAFT" || course.status === "draft";
            const isPending = course.status === "PENDING_APPROVAL";
            const isApproved = course.status === "APPROVED";
            const isRejected = course.status === "REJECTED";
            const isSubmittingThis = submitting === course.courseId;

            return (
              <div key={course.courseId}>
                {/* COURSE CARD */}
                <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                  {/* COURSE THUMBNAIL */}
                  <div className="h-48 relative overflow-hidden bg-gradient-to-br from-emerald-100 to-green-100">
                    {course.thumbnail || course.thumbnailUrl || course.image ? (
                      <img
                        src={
                          course.thumbnail ||
                          course.thumbnailUrl ||
                          course.image
                        }
                        alt={course.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.querySelector(
                            ".fallback-icon",
                          ).style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`fallback-icon absolute inset-0 flex items-center justify-center ${
                        course.thumbnail || course.thumbnailUrl || course.image
                          ? "hidden"
                          : ""
                      }`}
                    >
                      <BookOpen size={64} className="text-emerald-600/30" />
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm ${
                          isApproved
                            ? "bg-emerald-100/90 text-emerald-700"
                            : isPending
                              ? "bg-blue-100/90 text-blue-700"
                              : isRejected
                                ? "bg-red-100/90 text-red-700"
                                : isDraft
                                  ? "bg-amber-100/90 text-amber-700"
                                  : "bg-slate-100/90 text-slate-600"
                        }`}
                      >
                        {isApproved
                          ? "Đã duyệt"
                          : isPending
                            ? "Chờ duyệt"
                            : isRejected
                              ? "Từ chối"
                              : isDraft
                                ? "Bản nháp"
                                : course.status}
                      </span>
                    </div>
                  </div>

                  {/* COURSE HEADER */}
                  <div className="p-6 flex-1">
                    {/* Title */}
                    <h2 className="font-bold text-lg text-slate-800 mb-4 line-clamp-2 min-h-[3.5rem]">
                      {course.title}
                    </h2>

                    {/* Course Info */}
                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign
                          size={16}
                          className="text-emerald-600 flex-shrink-0"
                        />
                        <span className="font-semibold text-emerald-700">
                          {course.price?.toLocaleString()} đ
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User
                          size={16}
                          className="text-slate-400 flex-shrink-0"
                        />
                        <span className="truncate">
                          {course.constructorName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers
                          size={16}
                          className="text-slate-400 flex-shrink-0"
                        />
                        <span>
                          {modules.length} module
                          {modules.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    {/* ✅ Rejection Reason */}
                    {isRejected && course.rejectionReason && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle
                            size={16}
                            className="text-red-600 flex-shrink-0 mt-0.5"
                          />
                          <div>
                            <p className="text-xs font-semibold text-red-700 mb-1">
                              Lý do từ chối:
                            </p>
                            <p className="text-xs text-red-600">
                              {course.rejectionReason}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 pt-0 space-y-2">
                    <button
                      onClick={() => handleToggleExpand(course.courseId)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 shadow-sm"
                    >
                      <List size={18} />
                      Xem Modules
                    </button>

                    <button
                      onClick={() => handleToggleCreateModule(course.courseId)}
                      disabled={isPending || isApproved}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                        isPending || isApproved
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "border-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
                      }`}
                    >
                      <Plus size={18} />
                      Thêm Module
                    </button>

                    {/* ✅ Submit for Approval Button */}
                    {isDraft && (
                      <>
                        <button
                          onClick={() =>
                            handleSubmitForApproval(course.courseId)
                          }
                          disabled={isSubmittingThis || modules.length < 3}
                          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                            modules.length < 3
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : isSubmittingThis
                                ? "bg-orange-400 text-white cursor-wait"
                                : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-sm"
                          }`}
                        >
                          {isSubmittingThis ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Đang gửi...
                            </>
                          ) : (
                            <>
                              <Send size={18} />
                              Gửi duyệt
                            </>
                          )}
                        </button>

                        {/* ✅ Module count warning */}
                        {modules.length < 3 && (
                          <div className="text-center py-1.5 px-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-xs text-amber-700 font-medium">
                              ⚠️ Cần ít nhất 3 modules ({modules.length}/3)
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {/* ✅ Pending status indicator */}
                    {isPending && (
                      <div className="text-center py-2.5 px-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-sm text-blue-700 font-medium">
                          ⏳ Đang chờ staff xét duyệt
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* ================= LIST MODULES MODAL ================= */}
                {isExpanded &&
                  createPortal(
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                              <List size={24} className="text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">
                                {course.title}
                              </h3>
                              <p className="text-emerald-100 text-sm">
                                Danh sách Modules ({modules.length})
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleExpand(course.courseId)}
                            className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
                          >
                            <X size={20} className="text-white" />
                          </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
                          {modules.length > 0 ? (
                            <div className="grid gap-3">
                              {modules.map((m) => {
                                const moduleId =
                                  m.moduleId || m.id || m.module_id;
                                const lessonCount = m.lessons?.length || 0;

                                return (
                                  <div
                                    key={moduleId}
                                    onClick={() => handleModuleClick(m, course)}
                                    className="group bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md transition-all cursor-pointer"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 group-hover:bg-emerald-200 rounded-lg flex items-center justify-center text-emerald-700 font-bold transition-colors">
                                          {m.orderIndex}
                                        </div>
                                        <div>
                                          <h4 className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                                            {m.title}
                                          </h4>
                                          {lessonCount > 0 && (
                                            <p className="text-xs text-slate-500 mt-0.5">
                                              {lessonCount} bài học
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <ArrowRight
                                        size={20}
                                        className="text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all"
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-12 px-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Layers size={32} className="text-slate-400" />
                              </div>
                              <p className="text-sm text-slate-500 font-medium">
                                Chưa có module nào
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                Thêm module đầu tiên cho khóa học này
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>,
                    document.body,
                  )}

                {/* ================= CREATE MODULE MODAL ================= */}
                {isCreateFormOpen &&
                  createPortal(
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                              <Plus size={24} className="text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white">
                                Tạo Module mới
                              </h3>
                              <p className="text-blue-100 text-sm">
                                {course.title}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleToggleCreateModule(course.courseId)
                            }
                            className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
                          >
                            <X size={20} className="text-white" />
                          </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
                          <CreateModule
                            courseId={course.courseId}
                            onCreated={() =>
                              handleModuleCreated(course.courseId)
                            }
                          />
                        </div>
                      </div>
                    </div>,
                    document.body,
                  )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
