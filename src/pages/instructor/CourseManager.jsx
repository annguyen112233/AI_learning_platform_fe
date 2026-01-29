import { useEffect, useState } from "react";
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
} from "lucide-react";
import { getCoursesByInstructor } from "../../services/courseService";
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

  /* ================= FETCH COURSES ================= */
  const fetchCourses = async () => {
    try {
      setLoading(true);

      const meRes = await api.get("/accounts/me");
      const instructorId = meRes.data.data.id;

      const res = await getCoursesByInstructor(instructorId);
      setCourses(res.data.data || []);
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

      // 🔍 DEBUG: Kiểm tra structure của module
      if (modulesData.length > 0) {
        console.log("First module:", modulesData[0]);
        console.log("Module keys:", Object.keys(modulesData[0]));
      }

      setModulesMap((prev) => ({
        ...prev,
        [courseId]: modulesData,
      }));
    } catch (error) {
      console.error("Failed to fetch modules for courseId:", courseId, error);
    }
  };

  /* ================= TOGGLE EXPAND ================= */
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

    console.log("🔍 Navigating:", {
      courseId: course.courseId,
      moduleId,
    });

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
            const isFormOpen = selectedCourseId === course.courseId;
            const modules = modulesMap[course.courseId] || [];

            return (
              <div
                key={course.courseId}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
              >
                {/* COURSE HEADER */}
                <div className="p-6 flex-1">
                  {/* Icon & Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                      <BookOpen size={28} className="text-emerald-600" />
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        course.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : course.status === "draft"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {course.status === "active"
                        ? "Đang hoạt động"
                        : course.status === "draft"
                          ? "Bản nháp"
                          : course.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-bold text-lg text-slate-800 mb-4 line-clamp-2 min-h-[3.5rem]">
                    {course.title}
                  </h2>

                  {/* Course Info */}
                  <div className="space-y-2 text-sm text-slate-600">
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
                      <span className="truncate">{course.constructorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers
                        size={16}
                        className="text-slate-400 flex-shrink-0"
                      />
                      <span>
                        {modules.length} module{modules.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expand Button */}
                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleToggleExpand(course.courseId)}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                      isExpanded
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 shadow-sm"
                    }`}
                  >
                    {isExpanded ? (
                      <>
                        Thu gọn
                        <ChevronUp size={18} />
                      </>
                    ) : (
                      <>
                        Xem chi tiết
                        <ChevronDown size={18} />
                      </>
                    )}
                  </button>
                </div>

                {/* EXPANDED SECTION - Full Width Overlay */}
                {isExpanded && (
                  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                      {/* Modal Header */}
                      <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <BookOpen size={24} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {course.title}
                            </h3>
                            <p className="text-emerald-100 text-sm">
                              Quản lý modules
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
                        <div className="space-y-4">
                          {/* MODULES LIST */}
                          {modules.length > 0 ? (
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                  <Layers
                                    size={18}
                                    className="text-emerald-600"
                                  />
                                  Danh sách Modules
                                </h3>
                                <span className="text-sm text-slate-500">
                                  {modules.length} module
                                  {modules.length > 1 ? "s" : ""}
                                </span>
                              </div>
                              <div className="grid gap-3">
                                {modules.map((m) => {
                                  const moduleId =
                                    m.moduleId || m.id || m.module_id;

                                  return (
                                    <div
                                      key={moduleId}
                                      onClick={() =>
                                        handleModuleClick(m, course)
                                      }
                                      className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 font-bold text-sm">
                                            {m.orderIndex}
                                          </div>
                                          <div>
                                            <h4 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                                              {m.title}
                                            </h4>
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
                            </div>
                          ) : (
                            <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Layers size={24} className="text-slate-400" />
                              </div>
                              <p className="text-sm text-slate-500 font-medium">
                                Chưa có module nào
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                Thêm module đầu tiên cho khóa học này
                              </p>
                            </div>
                          )}

                          {/* CREATE MODULE BUTTON */}
                          <button
                            onClick={() =>
                              handleToggleCreateModule(course.courseId)
                            }
                            className={`w-full px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                              isFormOpen
                                ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow-md"
                            }`}
                          >
                            {isFormOpen ? (
                              <>
                                <X size={20} />
                                Đóng form
                              </>
                            ) : (
                              <>
                                <Plus size={20} />
                                Thêm Module mới
                              </>
                            )}
                          </button>

                          {/* CREATE MODULE FORM */}
                          {isFormOpen && (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                  <Plus size={20} className="text-white" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-blue-900">
                                    Tạo Module mới
                                  </h3>
                                  <p className="text-sm text-blue-700">
                                    {course.title}
                                  </p>
                                </div>
                              </div>
                              <CreateModule
                                courseId={course.courseId}
                                onCreated={() =>
                                  handleModuleCreated(course.courseId)
                                }
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
