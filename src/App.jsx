import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Pages
import Login from "@/pages/public/Login";
import StudentLayout from "@/layouts/StudentLayout";
import StudentDashboard from "@/pages/student/Dashboard";
import MyCourses from "@/pages/student/MyCourses";
import CoursePlayer from "@/pages/student/CoursePlayer";
import StudentProfile from "@/pages/student/Profile";
import Register from "./pages/public/Register";
import ForgotPassword from "./pages/public/ForgotPassword";
import ResetPassword from "./pages/public/ResetPassword";
import { AuthProvider } from "@/context/AuthContext";


// Placeholders
const InstructorDashboard = () => (
  <div className="p-10 text-purple-600">
    <h1>Dashboard Giảng Viên</h1>
  </div>
);
const AdminDashboard = () => (
  <div className="p-10 text-red-600">
    <h1>Dashboard Admin</h1>
  </div>
);
const NotFound = () => (
  <div className="p-10 text-center">
    <h1>404 Not Found</h1>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* ✅ TOASTER GLOBAL */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 2000, // 👈 3 giây
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
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Student Routes */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<MyCourses />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* Learning Space */}
          <Route
            path="/student/learning/:courseId"
            element={<CoursePlayer />}
          />

          {/* Other Routes */}
          <Route
            path="/instructor/dashboard"
            element={<InstructorDashboard />}
          />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
