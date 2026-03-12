import api from './api';

export const getAllCourses = (page = 1, size = 10, search = '', sortBy = 'trending') => {
  return api.get('/courses/all-course/public', {
    params: { page, size, search, sortBy }
  });
}

export const getCourseStats = () => {
  return api.get('/courses/stats');
}

export const getCoursesForStudent = () => {
  return api.get('/courses/all-course/students');
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