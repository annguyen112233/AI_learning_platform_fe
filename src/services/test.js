import api from "./api";

export const getTest = () => {
  return api.get(`/placement-test/questions`);
};