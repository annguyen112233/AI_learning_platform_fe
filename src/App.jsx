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

// Public Pages
import Login from "@/pages/public/Login";
import Home from "@/pages/public/Home";
import Register from "@/pages/public/Register";
import ForgotPassword from "@/pages/public/ForgotPassword";
import ResetPassword from "@/pages/public/ResetPassword";
import PaymentResult from "@/pages/PaymentResult";
import PlacementTest from "@/pages/PlacementTest";

// Student Pages & Layout
import StudentLayout from "@/layouts/StudentLayout";
import StudentDashboard from "@/pages/student/Dashboard";
import MyCourses from "@/pages/student/MyCourses";
import CoursePlayer from "@/pages/student/CoursePlayer";
import StudentProfile from "@/pages/student/Profile";
import ChatMessage from "@/pages/student/ChatMessage";
import Achievements from "@/pages/student/Achievements";
import CourseDetail from "@/pages/student/CourseDetail";
import QuizPage from "@/pages/student/MockTestPage";
import Certificate from "@/pages/student/Certificate";

// Instructor Pages & Layout
import InstructorLayout from "@/layouts/InstructorLayout";
import InstructorDashboard from "@/pages/instructor/InstructorDashboard";
import InstructorCourses from "@/pages/instructor/InstructorCourses";
import InstructorStudents from "@/pages/instructor/InstructorStudents";
import InstructorAnalytics from "@/pages/instructor/InstructorAnalytics";
import InstructorProfile from "@/pages/instructor/Profile";
import ModuleManager from "@/pages/instructor/ModuleManager";

// Staff Pages & Layout
import StaffLayout from "@/layouts/StaffLayout";
import StaffDashboard from "@/pages/staff/StaffDashboard";
import StaffModeration from "@/pages/staff/StaffModeration";
import StaffReports from "@/pages/staff/StaffReports";
import StaffDiscussions from "@/pages/staff/StaffDiscussions";
import StaffPlacementDocs from "@/pages/staff/StaffPlacementDocs";
import StaffProfile from "@/pages/staff/Profile";

// Admin Pages & Layout
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UserManagement from "@/pages/admin/UserManagement";
import CourseManagement from "@/pages/admin/CourseManagement";

// Fallback
const NotFound = () => (
  <div className="p-10 text-center">
    <h1 className="text-2xl font-bold text-slate-700">404 Not Found</h1>
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
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="courses" element={<MyCourses />} />
              <Route path="mock-test" element={<QuizPage />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="chat" element={<ChatMessage />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="course/:id" element={<CourseDetail />} />
              <Route path="certificate/:courseId" element={<Certificate />} />
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
              <Route path="courses" element={<InstructorCourses />} />
              <Route path="students" element={<InstructorStudents />} />
              <Route path="analytics" element={<InstructorAnalytics />} />
              <Route path="profile" element={<InstructorProfile />} />
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
              <Route path="dashboard" element={<StaffDashboard />} />
              <Route path="moderation" element={<StaffModeration />} />
              <Route path="discussions" element={<StaffDiscussions />} />
              <Route path="reports" element={<StaffReports />} />
              <Route path="placement-docs" element={<StaffPlacementDocs />} />
              <Route path="profile" element={<StaffProfile />} />
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
              <Route path="users" element={<UserManagement />} />
              <Route path="courses" element={<CourseManagement />} />
            </Route>

            {/* ================= CATCH ALL ================= */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </SubscriptionProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;