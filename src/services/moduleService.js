import api from "./api";

export const createModule = (data) => {
  return api.post("/modules", data);
};

export const getModulesByCourse = (courseId) => {
  return api.get(`/modules/course/${courseId}`);
};
