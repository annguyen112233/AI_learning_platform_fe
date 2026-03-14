import api from "./api";

export const createModule = (data) => {
  return api.post("/modules", data);
};

export const getModulesByCourse = (courseId) => {
  return api.get(`/modules/course/${courseId}`);
};

export const updateModule = (moduleId, title, orderIndex) => {
  let url = `/modules/${moduleId}?`;
  if (title) url += `title=${encodeURIComponent(title)}&`;
  if (orderIndex !== undefined) url += `orderIndex=${orderIndex}`;
  return api.put(url.endsWith("&") || url.endsWith("?") ? url.slice(0, -1) : url);
};

export const deleteModule = (moduleId) => {
  return api.delete(`/modules/${moduleId}`);
};
