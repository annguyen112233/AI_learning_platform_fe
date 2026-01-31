import api from './api';

export const getAllCourses = () => {
  return api.get('/courses/all-course/public');
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

