import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from '@/pages/public/Login';
import StudentLayout from '@/layouts/StudentLayout';
import StudentDashboard from '@/pages/student/Dashboard';
import MyCourses from '@/pages/student/MyCourses';       // <--- NEW
import CoursePlayer from '@/pages/student/CoursePlayer'; // <--- NEW
import StudentProfile from '@/pages/student/Profile';

// Placeholders
const InstructorDashboard = () => <div className="p-10 text-purple-600"><h1>Dashboard Giảng Viên</h1></div>;
const AdminDashboard = () => <div className="p-10 text-red-600"><h1>Dashboard Admin</h1></div>;
const NotFound = () => <div className="p-10 text-center"><h1>404 Not Found</h1></div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<MyCourses />} />       {/* <--- NEW: List khóa học */}
            <Route path="profile" element={<StudentProfile />} /> {/* <--- THÊM DÒNG NÀY */}
            {/* Các route khác trong Layout */}
        </Route>

        {/* Learning Space nằm NGOÀI Layout Student (để full màn hình, không hiện Sidebar) */}
        <Route path="/student/learning/:courseId" element={<CoursePlayer />} /> {/* <--- NEW: Player */}

        {/* Other Routes */}
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;