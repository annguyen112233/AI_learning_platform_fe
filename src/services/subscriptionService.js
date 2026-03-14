import api from "./api";

export const getSubscriptionStudent = () => {
  return api.get(`/subscription`);
};