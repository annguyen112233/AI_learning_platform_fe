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