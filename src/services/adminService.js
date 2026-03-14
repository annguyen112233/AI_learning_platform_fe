import api from './api';

// ── Admin: Dashboard ──────────────────────────────────────────────────────
export const getAdminDashboard = async () => {
    const res = await api.get('/admin/dashboard');
    return res.data.data;
};

// ── Admin: Users ──────────────────────────────────────────────────────────
export const getAdminUsers = async () => {
    const res = await api.get('/admin/users');
    return res.data.data;
};
export const toggleUserStatus = async (userId) => {
    const res = await api.put(`/admin/users/${userId}/toggle-status`);
    return res.data;
};
export const deleteAdminUser = async (userId) => {
    const res = await api.delete(`/admin/users/${userId}`);
    return res.data;
};

// ── Admin: Courses ────────────────────────────────────────────────────────
export const getAdminCourses = async (status = '') => {
    const params = status ? { status } : {};
    const res = await api.get('/admin/courses', { params });
    return res.data.data;
};
export const verifyCourse = async (courseId, action, reason = '') => {
    const params = { action };
    if (reason) params.reason = reason;
    const res = await api.put(`/admin/courses/${courseId}/verify`, null, { params });
    return res.data.data;
};

// ── Instructor: Dashboard ─────────────────────────────────────────────────
export const getInstructorDashboard = async () => {
    const res = await api.get('/instructor/dashboard');
    return res.data.data;
};

export const getInstructorCourses = async (status = '') => {
    const params = status ? { status } : {};
    const res = await api.get('/instructor/courses', { params });
    return res.data.data;
};

export const getInstructorStudents = async () => {
    const res = await api.get('/instructor/students');
    return res.data.data;
};
