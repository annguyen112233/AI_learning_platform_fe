import api from './api';

export const enrollCourse = (courseId) => {
  return api.post(`/enrollments`, { courseId });
}