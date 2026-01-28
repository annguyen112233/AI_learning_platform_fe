import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context & Auth
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";

// Public Pages
import Login from "@/pages/public/Login";
import Register from "./pages/public/Register";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";

// Student Pages & Layout
import StudentLayout from "@/layouts/StudentLayout";
import StudentDashboard from "@/pages/student/Dashboard";
import MyCourses from "@/pages/student/MyCourses";
import CoursePlayer from "@/pages/student/CoursePlayer";
import StudentProfile from "@/pages/student/Profile";

// Instructor Pages
import InstructorDashboard from "./pages/instructor/InstructorDashboard";

// Admin Pages & Layout
// ✅ FIX 1: Import đúng file AdminLayout (đã tạo ở bước trước)
import AdminLayout from "@/layouts/AdminLayout"; 
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";

// Fallback
const NotFound = () => (
  <div className="p-10 text-center">
    <h1 className="text-2xl font-bold text-slate-700">404 Not Found</h1>
  </div>
);

function App() {
  return (
    <AuthProvider>
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
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ================= STUDENT ROUTES ================= */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowRoles={["STUDENT"]}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* Learning Space (Full screen) */}
          <Route
            path="/student/learning/:courseId"
            element={
              <ProtectedRoute allowRoles={["STUDENT"]}>
                <CoursePlayer />
              </ProtectedRoute>
            }
          />

          {/* ================= INSTRUCTOR ROUTES ================= */}
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute allowRoles={["INSTRUCTOR"]}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ROUTES (ĐÃ SỬA) ================= */}
          {/* ✅ FIX 2: Dùng Nested Route để AdminLayout bao bọc các trang con */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowRoles={["ADMIN"]}>
                <AdminLayout /> {/* Layout nằm ở đây, chứa <Outlet /> */}
              </ProtectedRoute>
            }
          >
            {/* Nếu vào /admin thì tự nhảy sang dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
            
            {/* Các trang con sẽ hiện vào vị trí <Outlet /> trong AdminLayout */}
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            
            {/* Sau này thêm route courses ở đây */}
            {/* <Route path="courses" element={<CourseManagement />} /> */}
          </Route>

          {/* ================= CATCH ALL ================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;