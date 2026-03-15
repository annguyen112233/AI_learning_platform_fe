import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context & Auth
import { AuthProvider } from "@/context/AuthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { LanguageProvider } from "@/context/LanguageContext";

import ProtectedRoute from "@/routes/ProtectedRoute";
import PageLoader from "@/components/common/PageLoader";

// =============================================
// ✅ LAZY LOADING - Tất cả pages chỉ load khi cần
// =============================================

// Public Pages
const Login           = lazy(() => import("@/pages/public/Login"));
const Home            = lazy(() => import("@/pages/public/Home"));
const Register        = lazy(() => import("@/pages/public/Register"));
const ForgotPassword  = lazy(() => import("@/pages/public/ForgotPassword"));
const ResetPassword   = lazy(() => import("@/pages/public/ResetPassword"));
const PaymentResult   = lazy(() => import("@/pages/PaymentResult"));
const PlacementTest   = lazy(() => import("@/pages/PlacementTest"));

// Student Pages & Layout
const StudentLayout   = lazy(() => import("@/layouts/StudentLayout"));
const StudentDashboard = lazy(() => import("@/pages/student/Dashboard"));
const MyCourses       = lazy(() => import("@/pages/student/MyCourses"));
const CoursePlayer    = lazy(() => import("@/pages/student/CoursePlayer"));
const StudentProfile  = lazy(() => import("@/pages/student/Profile"));
const ChatMessage     = lazy(() => import("@/pages/student/ChatMessage"));
const Achievements    = lazy(() => import("@/pages/student/Achievements"));
const CourseDetail    = lazy(() => import("@/pages/student/CourseDetail"));
const QuizPage        = lazy(() => import("@/pages/student/MockTestPage"));

// Instructor Pages & Layout
const InstructorLayout    = lazy(() => import("@/layouts/InstructorLayout"));
const InstructorDashboard = lazy(() => import("@/pages/instructor/InstructorDashboard"));
const InstructorCourses   = lazy(() => import("@/pages/instructor/InstructorCourses"));
const InstructorStudents  = lazy(() => import("@/pages/instructor/InstructorStudents"));
const InstructorAnalytics = lazy(() => import("@/pages/instructor/InstructorAnalytics"));
const InstructorProfile   = lazy(() => import("@/pages/instructor/Profile"));
const ModuleManager       = lazy(() => import("@/pages/instructor/ModuleManager"));

// Staff Pages & Layout
const StaffLayout        = lazy(() => import("@/layouts/StaffLayout"));
const StaffDashboard     = lazy(() => import("@/pages/staff/StaffDashboard"));
const StaffModeration    = lazy(() => import("@/pages/staff/StaffModeration"));
const StaffReports       = lazy(() => import("@/pages/staff/StaffReports"));
const StaffDiscussions   = lazy(() => import("@/pages/staff/StaffDiscussions"));
const StaffPlacementDocs = lazy(() => import("@/pages/staff/StaffPlacementDocs"));
const StaffProfile       = lazy(() => import("@/pages/staff/Profile"));

// Admin Pages & Layout
const AdminLayout       = lazy(() => import("@/layouts/AdminLayout"));
const AdminDashboard    = lazy(() => import("@/pages/admin/AdminDashboard"));
const UserManagement    = lazy(() => import("@/pages/admin/UserManagement"));
const CourseManagement  = lazy(() => import("@/pages/admin/CourseManagement"));

// Fallback 404
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-slate-800 mb-2">404</h1>
      <p className="text-xl text-slate-500 mb-6">Trang không tìm thấy</p>
      <a
        href="/"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
      >
        Về trang chủ
      </a>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SubscriptionProvider>
          <Router>
            {/* ✅ TOASTER GLOBAL CONFIGURATION */}
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: "14px",
                  background: "#0f172a",
                  color: "#fff",
                  fontWeight: "600",
                  padding: "12px 16px",
                },
                success: {
                  iconTheme: { primary: "#22c55e", secondary: "#ecfdf5" },
                },
                error: {
                  iconTheme: { primary: "#ef4444", secondary: "#fef2f2" },
                },
              }}
            />

            {/* ✅ SUSPENSE TOÀN CỤC - hiện PageLoader khi lazy load */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* ================= PUBLIC ROUTES ================= */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Payment Result */}
                <Route path="/payment-result" element={<PaymentResult />} />

                {/* Placement Test - PUBLIC, không cần đăng nhập */}
                <Route path="/placement-test" element={<PlacementTest />} />

                {/* ================= STUDENT ROUTES ================= */}
                <Route
                  path="/student"
                  element={
                    <ProtectedRoute allowRoles={["STUDENT", "STAFF", "ADMIN"]}>
                      <StudentLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard"    element={<StudentDashboard />} />
                  <Route path="courses"      element={<MyCourses />} />
                  <Route path="mock-test"    element={<QuizPage />} />
                  <Route path="profile"      element={<StudentProfile />} />
                  <Route path="chat"         element={<ChatMessage />} />
                  <Route path="achievements" element={<Achievements />} />
                  <Route path="course/:id"   element={<CourseDetail />} />
                </Route>

                {/* Learning Space (Full screen - Không dùng Layout) */}
                <Route
                  path="/student/learning/:courseId"
                  element={
                    <ProtectedRoute allowRoles={["STUDENT", "STAFF", "ADMIN"]}>
                      <CoursePlayer />
                    </ProtectedRoute>
                  }
                />

                {/* ================= INSTRUCTOR ROUTES ================= */}
                <Route
                  path="/instructor"
                  element={
                    <ProtectedRoute allowRoles={["INSTRUCTOR"]}>
                      <InstructorLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<InstructorDashboard />} />
                  <Route path="courses"   element={<InstructorCourses />} />
                  <Route path="students"  element={<InstructorStudents />} />
                  <Route path="analytics" element={<InstructorAnalytics />} />
                  <Route path="profile"   element={<InstructorProfile />} />
                </Route>

                {/* Module Manager (Full screen cho instructor - Không dùng Layout) */}
                <Route
                  path="/instructor/module/:moduleId"
                  element={
                    <ProtectedRoute allowRoles={["INSTRUCTOR"]}>
                      <ModuleManager />
                    </ProtectedRoute>
                  }
                />

                {/* ================= STAFF ROUTES ================= */}
                <Route
                  path="/staff"
                  element={
                    <ProtectedRoute allowRoles={["STAFF"]}>
                      <StaffLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard"      element={<StaffDashboard />} />
                  <Route path="moderation"     element={<StaffModeration />} />
                  <Route path="discussions"    element={<StaffDiscussions />} />
                  <Route path="reports"        element={<StaffReports />} />
                  <Route path="placement-docs" element={<StaffPlacementDocs />} />
                  <Route path="profile"        element={<StaffProfile />} />
                </Route>

                {/* ================= ADMIN ROUTES ================= */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowRoles={["ADMIN"]}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users"     element={<UserManagement />} />
                  <Route path="courses"   element={<CourseManagement />} />
                </Route>

                {/* ================= CATCH ALL ================= */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Router>
        </SubscriptionProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;