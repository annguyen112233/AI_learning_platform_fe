import api from "./api";

export const createCourse = (data) => api.post("/courses", data);

export const getCoursesByInstructor = (instructorId) => {
  return api.get("/courses/all", {
    params: {
      constructorId: instructorId,
    },
  });
};
