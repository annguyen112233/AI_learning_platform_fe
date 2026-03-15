import api from './api';

export const getAllCourses = (page = 1, size = 10, search = '', sortBy = 'trending', jlptLevel = '') => {
  const params = { page, size, search, sortBy };
  if (jlptLevel) params.jlptLevel = jlptLevel;
  return api.get('/courses/all-course/public', { params });
}

export const getCourseStats = () => {
  return api.get('/courses/stats');
}

export const getCoursesForStudent = (page = 1, size = 10, search = '', status = '') => {
  const params = { page, size };
  if (search) params.search = search;
  if (status) params.status = status;
  return api.get('/courses/all-course/students', { params });
}

export const getCourseById = (courseId) => {
  return api.get(`/courses/${courseId}`);
}


export const createCourse = (data) => api.post("/courses", data);

export const getCoursesByInstructor = (instructorId) => {
  return api.get("/courses/all", {
    params: {
      constructorId: instructorId,
    },
  });
};

export const verifyCourseAprroved = (courseId, status, reason) => {
  return api.put(`/courses/${courseId}/verify`, {
    status,
    reason
  });
};

export const submitCourseForApproval = (courseId) => {
  return api.post(`/courses/${courseId}/submit-approval`);
};

export const getStudentDashboard = () => {
  return api.get('/student/dashboard');
};

export const getStaffDashboard = () => {
  return api.get('/staff/dashboard');
};

// ===== UPDATE REQUEST FLOW =====
export const submitUpdateRequest = (courseId, note = '') => {
  return api.post(`/courses/${courseId}/submit-update`, { note });
};

export const reviewUpdateRequest = (courseId, action, reason = '') => {
  return api.put(`/courses/${courseId}/review-update`, { action, reason });
};

// ===== DELETION REQUEST FLOW =====
export const requestCourseDeletion = (courseId, reason = '') => {
  return api.post(`/courses/${courseId}/request-deletion`, { reason });
};

export const requestUnlock = (courseId, reason = '') => {
  return api.post(`/courses/${courseId}/request-unlock`, { reason });
};

export const reviewDeletionRequest = (courseId, action, reason = '') => {
  return api.put(`/courses/${courseId}/review-deletion`, { action, reason });
};

export const getCertificate = (courseId) => {
  return api.get(`/certificates/course/${courseId}`);
};