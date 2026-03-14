import api from './api';

export const enrollCourse = (payload) => {
  return api.post(`/enrollments`, payload);
};
