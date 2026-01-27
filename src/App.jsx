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

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

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
              background: "#0f172a", // slate-900
              color: "#fff",
              fontWeight: "600",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "#22c55e", // emerald-500
                secondary: "#ecfdf5",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444", // red-500
                secondary: "#fef2f2",
              },
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

          {/* ================= STUDENT ROUTES (PROTECTED) ================= */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowRoles={["STUDENT"]}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* Learning Space (Full screen, separate from layout) */}
          <Route
            path="/student/learning/:courseId"
            element={
              <ProtectedRoute allowRoles={["STUDENT"]}>
                <CoursePlayer />
              </ProtectedRoute>
            }
          />

          {/* ================= INSTRUCTOR ROUTES (PROTECTED) ================= */}
          <Route
            path="/instructor/dashboard"
            element={
              <ProtectedRoute allowRoles={["INSTRUCTOR"]}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ROUTES (PROTECTED) ================= */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= CATCH ALL ================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;